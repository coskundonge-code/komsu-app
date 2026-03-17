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
        { label: "Hakkında", href: "/hakkinda" },
        { label: "Nasıl Çalışır", href: "/nasil-calisir" },
        { label: "Blog", href: "/blog" },
        { label: "Kariyer", href: "/kariyer" },
      ],
    },
    {
      title: "Destek",
      links: [
        { label: "Yardım Merkezi", href: "/yardim" },
        { label: "Güvenlik", href: "/guvenlik" },
        { label: "Topluluk Kuralları", href: "/topluluk-kurallari" },
        { label: "İletişim", href: "/iletisim" },
      ],
    },
    {
      title: "Yasal",
      links: [
        { label: "Kullanım Koşulları", href: "/kosullar" },
        { label: "Gizlilik Politikası", href: "/gizlilik" },
        { label: "Çerez Politikası", href: "/cerez-politikasi" },
        { label: "KVKK", href: "/kvkk" },
      ],
    },
    {
      title: "İndir",
      links: [
        { label: "App Store", href: "https://apps.apple.com/mahallem" },
        { label: "Google Play", href: "https://play.google.com/store/apps/mahallem" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/mahallem", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://instagram.com/mahallem",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://facebook.com/mahallem",
      label: "Facebook",
    },
  ];

  return (
    <footer
      className={cn("border-t border-[#e0e0e0] bg-[#f0f2f5]", className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#333] mb-4">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#404040] hover:text-[#00833e] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#e0e0e0] pt-8">
          {/* Bottom Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright */}
            <p className="text-xs text-[#8f8f8f]">
              © {currentYear} Mahallem. Tüm hakları saklıdır.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-[#404040] hover:text-[#00833e] transition-colors duration-200"
                  >
                    <IconComponent size={18} />
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
