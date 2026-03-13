import { Github, Linkedin, Mail, FileText } from "lucide-react";

const socials = [
  {
    href: "https://github.com/premiumfriedrice",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/lloydalba/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:lloyddalba@gmail.com",
    icon: Mail,
    label: "Email",
  },
  {
    href: "/documents/LloydAlba_Resume.pdf",
    icon: FileText,
    label: "Resume",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs text-neutral-400 tracking-wide backdrop-blur-sm bg-black/20 rounded-md px-2 py-1">
          &copy; {new Date().getFullYear()} Lloyd Alba
        </p>
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("/") ? undefined : "_blank"}
              rel={s.href.startsWith("/") ? undefined : "noopener noreferrer"}
              className="text-neutral-400 hover:text-[#c4b5fd] transition-colors"
              aria-label={s.label}
            >
              <s.icon size={16} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
