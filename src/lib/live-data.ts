import "server-only";
import { cache } from "react";
import { liveSites } from "@/lib/content";

export type SiteStatus = {
  id: string;
  label: string;
  url: string;
  online: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  checkedAt: string;
};

export type GithubSummary = {
  login: string;
  name: string | null;
  avatarUrl: string | null;
  publicRepos: number | null;
  followers: number | null;
  latestCommits: {
    repo: string;
    message: string;
    date: string;
    url: string;
  }[];
  /** Day -> commit count, used for the contribution heat-map. */
  heatmap: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  source: "live" | "fallback";
};

const GITHUB_HANDLE = "min955379-glitch";
const GITHUB_API = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/**
 * Real GitHub telemetry. Falls back to the published numbers when the
 * API is unreachable (rate limit / offline) so the UI never shows a
 * fabricated or empty state.
 */
export const getGithubSummary = cache(async (): Promise<GithubSummary> => {
  const fallback: GithubSummary = {
    login: GITHUB_HANDLE,
    name: "Muhammad Ibrahim",
    avatarUrl: null,
    publicRepos: 8,
    followers: null,
    latestCommits: [],
    heatmap: [],
    source: "fallback",
  };

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${GITHUB_HANDLE}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`${GITHUB_API}/users/${GITHUB_HANDLE}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!profileRes.ok) return fallback;

    const profile = (await profileRes.json()) as {
      login: string;
      name: string | null;
      avatar_url: string | null;
      public_repos: number;
      followers: number;
    };

    const repos = reposRes.ok
      ? ((await reposRes.json()) as {
          name: string;
          pushed_at: string;
          html_url: string;
        }[])
      : [];

    const recent = repos
      .filter((repo) => repo.pushed_at)
      .slice(0, 12);

    const commitResults = await Promise.all(
      recent.slice(0, 6).map(async (repo) => {
        try {
          const res = await fetch(
            `${GITHUB_API}/repos/${GITHUB_HANDLE}/${repo.name}/commits?per_page=3`,
            { headers, next: { revalidate: 3600 } },
          );
          if (!res.ok) return [];
          const commits = (await res.json()) as {
            sha: string;
            commit: { message: string; author: { date: string } | null };
            html_url: string;
          }[];
          return commits.map((commit) => ({
            repo: repo.name,
            message: commit.commit.message.split("\n")[0],
            date: commit.commit.author?.date ?? new Date().toISOString(),
            url: commit.html_url,
          }));
        } catch {
          return [];
        }
      }),
    );

    const latestCommits = commitResults
      .flat()
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 6);

    // Contribution-style heat-map derived from repo push timestamps.
    const days: GithubSummary["heatmap"] = [];
    const dayMs = 86_400_000;
    const today = new Date();
    for (let i = 90; i >= 0; i -= 1) {
      const day = new Date(today.getTime() - i * dayMs);
      const key = day.toISOString().slice(0, 10);
      const count = repos.filter((repo) =>
        repo.pushed_at?.startsWith(key),
      ).length;
      const level: 0 | 1 | 2 | 3 | 4 =
        count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4;
      days.push({ date: key, count, level });
    }

    return {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      latestCommits,
      heatmap: days,
      source: "live",
    };
  } catch {
    return fallback;
  }
});

/**
 * Probes each live deployment server-side and reports reachability plus
 * latency. Replaces the previous static "VERIFIED LIVE" labels.
 */
export const getSiteStatuses = cache(async (): Promise<SiteStatus[]> => {
  const checkedAt = new Date().toISOString();

  const results = await Promise.all(
    liveSites.map(async (site) => {
      const started = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(site.url, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        const latencyMs = Date.now() - started;
        return {
          id: site.id,
          label: site.label,
          url: site.url,
          online: res.status < 500,
          statusCode: res.status,
          latencyMs,
          checkedAt,
        } satisfies SiteStatus;
      } catch {
        return {
          id: site.id,
          label: site.label,
          url: site.url,
          online: false,
          statusCode: null,
          latencyMs: null,
          checkedAt,
        } satisfies SiteStatus;
      }
    }),
  );

  return results;
});
