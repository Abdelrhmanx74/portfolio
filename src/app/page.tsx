import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Showcase } from "@/components/Showcase";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";

// Force static rendering for this page
export const dynamic = "force-static";
export const revalidate = false;

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-12">
        <Hero />
        <Experience />
        <Projects />
        <Showcase />
        <TechStack />
        <Contact />
      </main>
    </div>
  );
}
