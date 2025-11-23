import Image from "next/image";
import { asset } from "@/lib/asset";

export function Hero() {
  return (
    <section
      data-scroll-section
      className="min-h-screen flex items-center justify-center py-12 sm:py-24 px-6"
    >
      <div className="max-w-5xl w-full">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            {/* Mobile: simplified centered layout (name, larger image, punchline) */}
            <div className="w-full flex flex-col items-center sm:hidden mb-2">
              <h1 className="text-2xl font-bold mb-4">Abdelrhman Mahmoud</h1>
              <div className="w-60 h-60 md:w-48 md:h-48 bg-muted border border-border flex items-center justify-center text-6xl overflow-hidden rounded-full">
                <Image
                  src={asset('/me.jpg')}
                  alt="Abdelrhman Mahmoud - Frontend Developer"
                  width={220}
                  height={220}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                I like code tidy, side projects half-done (on purpose), and bugs
                that fear me more than deadlines. I&apos;m for new challenges
                and opportunities to learn and grow.
              </p>
            </div>

            {/* Desktop: original layout */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-muted border border-border hidden sm:flex items-center justify-center text-6xl overflow-hidden">
              <Image
                src={asset('/me.jpg')}
                alt="Abdelrhman Mahmoud - Frontend Developer"
                width={160}
                height={160}
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 hidden sm:block">
              <p
                className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2"
                data-testid="text-hero-intro"
              >
                Abdelrhman Mahmoud, Frontend Developer
              </p>
              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed"
                data-testid="text-hero-description"
              >
                I like code tidy, side projects half-done (on purpose), and bugs
                that fear me more than deadlines. I&apos;m always looking for
                new challenges and opportunities to learn and grow.
              </p>
            </div>
            {/* Mobile: original description hidden because we show the simplified mobile layout above */}
            <div className="w-full sm:hidden mt-2 hidden">
              {/* intentionally hidden on mobile - replaced by simplified mobile layout */}
            </div>
          </div>
        </div>

        <div className="space-y-6 border-l-2 border-border pl-6">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              Hi, I&apos;m Abdelrhman Mahmoud
            </p>
            <p
              className="text-xs sm:text-sm md:text-base leading-relaxed"
              data-testid="text-hero-about"
            >
              I'm a self-taught frontend developer with a hands-on approach and
              an appreciation for clean, scalable UI. I recently left Dabbo Tech
              to focus on my final year of high school, and now I&apos;m ready
              to jump back into the workforce. I&apos;m not attending college —
              I&apos;m learning backend development (Express, NestJS) instead,
              getting myself semi-ready for a full-stack role. I care about best
              practices, developer experience, and writing code that&apos;s
              clean, readable, and easy to maintain.
            </p>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed mt-2">
              When I&apos;m not coding, you&apos;ll find me gaming, listening to
              music, or watching something.
            </p>
            {/*<p className="text-xs sm:text-sm md:text-base leading-relaxed mt-2">
              Also, I tried to make something that doesn&apos;t look like the
              usual Indian-template portfolio vibe — so I did this. I&apos;m
              sure it&apos;s been done a hundred times already, but hey, at
              least it&apos;s mine. 😄
            </p>*/}
          </div>
        </div>
      </div>
    </section>
  );
}
