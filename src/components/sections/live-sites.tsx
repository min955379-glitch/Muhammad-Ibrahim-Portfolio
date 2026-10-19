import { getSiteStatuses } from "@/lib/live-data";
import { liveSites } from "@/lib/content";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { LiveSitesPanel } from "@/components/sections/live-sites-panel";
import { Reveal } from "@/components/ui/reveal";

export async function LiveSites() {
  const statuses = await getSiteStatuses();
  const statusMap = new Map(statuses.map((status) => [status.id, status]));

  const items = liveSites.map((site) => ({
    site,
    status: statusMap.get(site.id) ?? null,
  }));

  return (
    <Section id="live-sites" tone="deep">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="01 // LIVE DEPLOYMENTS"
            label="Live Sites"
            title="Interactive Live Previews"
            subtitle="Tap any project tab below to inspect its live production preview and launch it in a new tab. Status is probed from the server — not a static badge."
            accent="indigo"
          />
        </Reveal>

        <LiveSitesPanel items={items} />
      </SectionShell>
    </Section>
  );
}
