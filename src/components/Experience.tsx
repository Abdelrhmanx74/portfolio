export function Experience() {
  return (
    <section id="experience" data-scroll-section className="py-12 sm:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-xl sm:text-2xl md:text-3xl mb-12 font-normal"
          data-testid="text-experience-heading"
        >
          Work Experience
        </h2>

        <div className="relative border-l-2 border-border pl-8">
          <div className="relative" data-testid="card-experience-dabbo">
            <div className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-10.25 bg-foreground border-2 border-background" />

            <div className="space-y-4">
              <div>
                <h3
                  className="text-base sm:text-lg md:text-xl mb-1"
                  data-testid="text-experience-title"
                >
                  Frontend Developer | Dabbo Tech | July 2023 – Feb 2025
                </h3>
                <p
                  className="text-xs sm:text-sm md:text-base text-muted-foreground mb-1"
                  data-testid="text-experience-company"
                >
                  At Dabbo Tech, I worked on building production-ready web
                  applications using React, Next.js, and TypeScript. My focus
                  was on creating scalable, maintainable code and delivering
                  smooth user experiences while considering best practices and ReactJS patterns.
                </p>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm md:text-base leading-relaxed">
                <li
                  className="flex gap-2"
                  data-testid="text-experience-achievement-1"
                >
                  <span className="text-muted-foreground">→</span>
                  <span>
                    Rebuilt complex frontends from scratch, improving
                    performance and design consistency.
                  </span>
                </li>
                <li
                  className="flex gap-2"
                  data-testid="text-experience-achievement-2"
                >
                  <span className="text-muted-foreground">→</span>
                  <span>
                    Developed reusable UI components and integrated them with
                    backend APIs.
                  </span>
                </li>
                <li
                  className="flex gap-2"
                  data-testid="text-experience-achievement-3"
                >
                  <span className="text-muted-foreground">→</span>
                  <span>
                    Collaborated with designers and backend engineers to ship
                    features on time.
                  </span>
                </li>
                <li
                  className="flex gap-2"
                  data-testid="text-experience-achievement-4"
                >
                  <span className="text-muted-foreground">→</span>
                  <span>
                    Mentored interns on dashboards and internal tools, helping
                    them write clean code.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
