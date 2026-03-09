import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
      {
        title: "Hakkında",
        links: ["Hakkımızda", "Kariyer", "Blog", "Basın"],
      },
      {
        title: "Destek",
        links: ["Yardım Merkezi", "İletişim", "Canlı Sohbet", "Bildir"],
      },
      {
        title: "Yasal",
        links: ["Gizlilik Politikası", "Hizmet Şartları", "Çerezler", "KVKK"],
      },
      {
        title: "Bağlantılar",
        links: ["Twitter", "Facebook", "Instagram", "LinkedIn"],
      },
    ];

    return (
      <footer
        ref={ref}
        className={cn("border-t border-gray-200 bg-gray-50", className)}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Links Grid */}
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900">
                  {section.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-[#00833e] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 py-8">
            {/* Logo and Description */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00833e] text-white font-bold">
                  K
                </div>
                <span className="font-bold text-gray-900">KomşuApp</span>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Komşularla bağlanın, mahallede birlikte gelişin. KomşuApp ile
                mahallenizdeki insanlarla etkileşim kurun.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                © {currentYear} KomşuApp. Tüm hakları saklıdır.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-[#00833e] transition-colors"
                >
                  Tercih Merkezi
                </a>
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-[#00833e] transition-colors"
                >
                  Erişilebilirlik
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export { Footer };
