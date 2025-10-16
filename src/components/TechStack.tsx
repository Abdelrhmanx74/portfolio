import Image from "next/image";

interface Tech {
  name: string;
  logo: string;
}

const techStack: Tech[] = [
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "NestJS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Shadcn/ui", logo: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4" },
  { name: "Zustand", logo: "https://repository-images.githubusercontent.com/180328715/fca49300-e7f1-11ea-9f51-cfd949b31560" },
  { name: "NextAuth.js", logo: "https://next-auth.js.org/img/logo/logo-sm.png" },
];

export function TechStack() {
  return (
    <section id="tech-stack" data-scroll-section className="py-12 sm:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl mb-12 font-normal" data-testid="text-tech-heading">
          Tech Stack
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-3 hover-elevate transition-all p-4"
              data-testid={`tech-item-${index}`}
            >
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  fill
                  className="object-contain filter brightness-90 dark:brightness-100"
                  sizes="(max-width: 768px) 48px, 64px"
                  loading="lazy"
                  data-testid={`img-tech-${tech.name.toLowerCase().replace(/[.\s/]/g, '-')}`}
                />
              </div>
              <span className="text-xs sm:text-sm text-center" data-testid={`text-tech-${tech.name.toLowerCase().replace(/[.\s/]/g, '-')}`}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
