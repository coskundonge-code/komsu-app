import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Mahallem",
      links: [
        { label: "Hakkinda", href: "/hakkinda" },
        { label: "Nasil Calisir", href: "/nasil-calisir" },
        { label: "Blog", href: "/blog" },
        { label: "Kariyer", href: "/kariyer" },
      ],
    },
    {
      title: "Destek",
      links: [
        { label: "Yardim Merkezi", href: "/yardim" },
        { label: "Guvenlik", href: "/guvenlik" },
        { label: "Topluluk Kurallari", href: "/topluluk-kurallari" },
        { label: "Iletisim", href: "/iletisim" },
      ],
    },
    {
      title: "Yasal",
      links: [
        { label: "Kullanim Kosullari", href: "/kosullar" },
        { label: "Gizlilik Politikasi", href: "/gizlilik" },
        { label: "Cerez Politikasi", href: "/cerez-politikasi" },
        { label: "KVKK", href: "/kvkk" },
      ],
    },
    {
      title: "Indir",
      links: [
        { label: "App Store", href: "#" },
        { label: "Google Play", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className={cn("border-t border-border bg-background", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              © {currentYear} Mahallem. Tum haklari saklidir.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 text-text-muted hover:text-primary hover:bg-surface-hover rounded-full transition-colors"
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
