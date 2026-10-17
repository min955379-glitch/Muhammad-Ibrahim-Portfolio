"use client";

import { PhoneMockup, type PhoneScreen } from "@/components/ui/phone-mockup";
import { Reveal } from "@/components/ui/reveal";
import { Tabs } from "@/components/ui/tabs";

const dailyMbScreens: PhoneScreen[] = [
  {
    id: "dailymb-icon",
    label: "App",
    image: "/images/dailymb-app-icon.svg",
    alt: "DailyMB Quiz Helper application icon",
    width: 512,
    height: 512,
  },
];

const mentalMathsScreens: PhoneScreen[] = [
  {
    id: "mm-dashboard",
    label: "Stats",
    image: "/images/mental-maths-dashboard-screen.webp",
    alt: "Mental Maths dark dashboard screen",
    width: 1080,
    height: 2200,
  },
  {
    id: "mm-practice",
    label: "Practice",
    image: "/images/mental-maths-practice-screen.webp",
    alt: "Mental Maths practice screen",
    width: 1080,
    height: 2200,
  },
  {
    id: "mm-quiz",
    label: "Quiz",
    image: "/images/mental-maths-quiz-screen.webp",
    alt: "Mental Maths quiz screen in dark mode",
    width: 786,
    height: 1600,
  },
];

const englishScreens: PhoneScreen[] = [
  {
    id: "ep-home",
    label: "Home (13 Levels)",
    image: "/images/english-practice-mobile-card.webp",
    alt: "My English Practice mobile dark home screen",
    width: 390,
    height: 1400,
  },
  {
    id: "ep-settings",
    label: "Voice & Theme",
    image: "/images/english-practice-settings-card.webp",
    alt: "My English Practice mobile dark settings screen",
    width: 390,
    height: 1400,
  },
];

export function PhoneShowcase() {
  const tabs = [
    {
      id: "dailymb",
      label: "DailyMB",
      content: (
        <PhoneMockup
          screens={dailyMbScreens}
          accent="var(--amber)"
          className="mx-auto max-w-sm"
        />
      ),
    },
    {
      id: "mental-maths",
      label: "Mental Maths",
      content: (
        <PhoneMockup
          screens={mentalMathsScreens}
          accent="var(--sky)"
          className="mx-auto max-w-sm"
        />
      ),
    },
    {
      id: "english",
      label: "My English Practice",
      content: (
        <PhoneMockup
          screens={englishScreens}
          accent="var(--violet)"
          className="mx-auto max-w-sm"
        />
      ),
    },
  ];

  return (
    <Reveal>
      <div className="mt-14 grid gap-8 rounded-[26px] border border-[var(--glass-border)] bg-[var(--surface)]/35 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p className="eyebrow text-[var(--sky)]">3D PHONE MOCKUP</p>
          <h3 className="mt-3 font-display text-[22px] font-bold leading-tight text-[var(--text)] sm:text-[26px]">
            The real screens, in a 3D frame
          </h3>
          <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-[var(--text-2)]">
            Every screenshot below is pulled straight from the shipped apps —
            the DailyMB launcher, the Mental Maths dashboard, practice and quiz
            views, and the My English Practice mobile build. Swipe inside the
            frame or use the pills to move between them.
          </p>

          <div className="mt-6">
            <Tabs items={tabs} />
          </div>
        </div>

        <div className="order-first lg:order-last">
          <PhoneMockup
            screens={mentalMathsScreens}
            accent="var(--sky)"
            className="mx-auto max-w-sm"
          />
        </div>
      </div>
    </Reveal>
  );
}
