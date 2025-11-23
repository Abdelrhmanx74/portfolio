import { asset } from "@/lib/asset";

interface ContactMethod {
  label: string;
  value: string;
  href: string;
  testId: string;
}

// small, naive formatter to make phone numbers a bit friendlier in the UI
function formatPhone(raw: string) {
  try {
    // do very little: remove spaces and keep plus if present
    const cleaned = raw.replace(/\s+/g, '');
    return cleaned;
  } catch {
    return raw;
  }
}

const contactMethods: ContactMethod[] = [
  {
    label: "Resume",
    value: "View resume",
    href: "/resume.pdf",
    testId: "link-resume"
  },
  {
    label: "Email",
    value: "abdelrhmanx74@gmail.com",
    href: "mailto:abdelrhmanx74@gmail.com",
    testId: "link-email"
  },
  {
    label: "Phone",
    value: "+20 1032257852",
    href: "tel:+201032257852",
    testId: "link-phone"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/abdelrhmanx74",
    href: "https://linkedin.com/in/abdelrhmanx74",
    testId: "link-linkedin"
  },
  {
    label: "GitHub",
    value: "github.com/abdelrhmanx74",
    href: "https://github.com/abdelrhmanx74",
    testId: "link-github"
  }
];

export function Contact() {
  return (
    <section id="contact" data-scroll-section className="py-12 sm:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl mb-12 font-normal" data-testid="text-contact-heading">
          Get in touch
        </h2>

        <div className="space-y-6">
          {contactMethods.map((method) => {
            let href = method.href;
            if (href.startsWith('/') && !href.startsWith('//')) {
              href = asset(href);
            }

            return (
              <a
                key={method.label}
                href={href}
                target={href.startsWith("http") || href.endsWith('.pdf') || method.label === 'Resume' ? "_blank" : undefined}
                rel={href.startsWith("http") || href.endsWith('.pdf') || method.label === 'Resume' ? "noopener noreferrer" : undefined}
                className="block border-l-2 border-border pl-6 hover-elevate transition-all"
                data-testid={method.testId}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground w-24" data-testid={`text-${method.testId}-label`}>
                    {method.label}:
                  </span>
                  <span className="text-xs sm:text-sm underline decoration-dotted" data-testid={`text-${method.testId}-value`}>
                    {method.label === 'Phone' ? formatPhone(method.value) : method.value}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Resume is now included as a contact pill above the email */}

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground text-center" data-testid="text-footer-copyright">
            © {new Date().getFullYear()} Abdelrhman Mahmoud. Built with Next.js, TypeScript & caffeine.
          </p>
        </div>
      </div>
    </section>
  );
}
