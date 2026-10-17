import { Hero } from "@/components/sections/hero";
import { LiveSites } from "@/components/sections/live-sites";
import { Projects } from "@/components/sections/projects";
import { MobileApks } from "@/components/sections/mobile-apks";
import { Services } from "@/components/sections/services";
import { Studio3D } from "@/components/sections/studio-3d";
import { Skills } from "@/components/sections/skills";
import { Arcade } from "@/components/sections/arcade";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export const revalidate = 900;

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveSites />
      <Projects />
      <MobileApks />
      <Services />
      <Studio3D />
      <Skills />
      <Arcade />
      <About />
      <Contact />
    </>
  );
}
