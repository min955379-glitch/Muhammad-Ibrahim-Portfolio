import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";
import { CommandPalette } from "@/components/layout/command-palette";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { Preloader } from "@/components/layout/preloader";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { siteConfig } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "Muhammad Ibrahim",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Supabase",
    "React Native",
    "Expo APK",
    "Tailwind CSS v4",
    "Blender 5.2",
    "FFmpeg",
    "Abbottabad",
    "Pakistan",
    "freelance developer",
    "full stack developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Full-Stack Web, Mobile & 3D Product Builder`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04060E" },
    { media: "(prefers-color-scheme: light)", color: "#F4F6FD" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <AppProviders>
          <ToastProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-[var(--surface)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--text)]"
            >
              Skip to main content
            </a>

            <Preloader />
            <ScrollProgress />
            <CursorGlow />
            <SmoothScroll />
            <Header />

            <main id="main-content" className="relative pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))] pb-[calc(88px+env(safe-area-inset-bottom,0px))] md:pb-0">
              {children}
            </main>

            <Footer />
            <MobileStickyBar />
            <CommandPalette />
            <div className="grain" aria-hidden />
          </ToastProvider>
        </AppProviders>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
