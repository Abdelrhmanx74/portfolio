interface Project {
  title: string;
  type: string;
  description: string;
  tech: string[];
  link?: string;
}

const projects: Project[] = [
  {
    title: "Experience.com",
    type: "Client Project",
    description:
      "Built a massive static site with over 70 pages packed with content and images. This required careful planning, structure, and optimization to keep everything organized and fast. Delivered a responsive UI and reusable components for smooth navigation and performance.",
    tech: ["NextJS", "Tailwind", "Framer Motion", "NextUI"],
    link: "https://experience.com",
  },
  {
    title: "Dipzin.com",
    type: "Company Project",
    description:
      "Took an existing website and rebuilt it from scratch in 2–3 months. Designed a custom design system using Storybook, Radix UI, and Shadcn/ui for consistency and speed. Also built a fully functional dashboard in less than a month, integrated with Strapi CMS for data management.",
    tech: ["NextJS", "TypeScript", "Storybook", "Shadcn", "Strapi", "AuthJS", "Zustand"],
    link: "https://dipzin.com",
  },
  {
    title: "StudyHive.com",
    type: "Client Project",
    description:
      "Developed a course library platform using new technologies I had never worked with before. Learned quickly and delivered the full site in about a month, including Typesense integration and search functionality for better UX and Custom made markdown for a blog center page.",
    tech: ["NextJS", "Typesense", "Shadcn"],
    link: "https://studyhive.com",
  },
  {
    title: "OSSkins (Open Source Skins)",
    type: "Personal Project",
    description:
      "Built a free desktop app for a game I play, as an alternative to a paid tool that costs $20. Created a cross-platform app using Tauri and React, reaching over 1,000 active users.",
    tech: ["Tauri", "NextJS", "Zustand"],
    link: "https://github.com/Abdelrhmanx74/osskins",
  },
];

export function Projects() {
  return (
    <section id="projects" data-scroll-section className="py-12 sm:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-xl sm:text-2xl md:text-3xl mb-12 font-normal"
          data-testid="text-projects-heading"
        >
          Selected Projects
        </h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="border-l-2 border-border pl-6 hover-elevate transition-all"
              data-testid={`card-project-${index}`}
            >
              <div className="mb-2">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg md:text-xl mb-1 underline decoration-dotted inline-block hover:text-primary transition-colors"
                    data-testid={`text-project-title-${index}`}
                  >
                    {project.title}
                  </a>
                ) : (
                  <h3
                    className="text-base sm:text-lg md:text-xl mb-1 underline decoration-dotted"
                    data-testid={`text-project-title-${index}`}
                  >
                    {project.title}
                  </h3>
                )}
                <p
                  className="text-xs sm:text-sm text-muted-foreground mb-2"
                  data-testid={`badge-project-type-${index}`}
                >
                  {project.type}
                </p>
              </div>

              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed mb-4"
                data-testid={`text-project-description-${index}`}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
                {project.tech.map((tech) => (
                  <span key={tech} data-testid={`badge-project-tech-${tech}`}>
                    [{tech}]
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
