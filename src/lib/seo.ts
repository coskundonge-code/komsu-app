import { Metadata } from "next";

export const BASE_URL = "https://komsuapp.com";

export const DEFAULT_OG_IMAGE = {
  url: `${BASE_URL}/icon-512.png`,
  width: 512,
  height: 512,
  alt: "KomşuApp Logo",
};

export const SEO_DEFAULTS = {
  title: {
    default: "KomşuApp - Mahalleni Keşfet",
    template: "%s | KomşuApp",
  },
  description:
    "KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin. Türkiye'nin mahalle sosyal ağı.",
  keywords: [
    "komşu",
    "mahalle",
    "sosyal ağ",
    "topluluk",
    "yerel",
    "etkinlik",
    "pazar yeri",
    "komşuluk",
    "mahalle haberleri",
    "yerel işletmeler",
  ],
  openGraph: {
    type: "website" as const,
    locale: "tr_TR",
    siteName: "KomşuApp",
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: "@komsuapp",
  },
};

/**
 * Generate metadata for a page with SEO defaults
 * @param overrides - Partial metadata to override defaults
 * @returns Complete metadata object
 */
export function generatePageMetadata(
  overrides: Partial<Metadata>
): Metadata {
  return {
    ...SEO_DEFAULTS,
    ...overrides,
    openGraph: {
      ...SEO_DEFAULTS.openGraph,
      ...(overrides.openGraph || {}),
      images: [DEFAULT_OG_IMAGE],
      url: overrides.openGraph?.url || BASE_URL,
    },
    twitter: {
      ...SEO_DEFAULTS.twitter,
      ...(overrides.twitter || {}),
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

/**
 * Generate URL for a page
 * @param path - The path (e.g., '/about', '/blog/my-post')
 * @returns Full URL
 */
export function getPageUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

/**
 * Common page metadata definitions
 */
export const PAGE_METADATA = {
  home: {
    title: "KomşuApp - Mahalleni Keşfet",
    description:
      "KomşuApp ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin.",
  },
  about: {
    title: "Hakkında | KomşuApp",
    description:
      "KomşuApp hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin. Mahalle topluluklarını güçlendiren platform.",
  },
  marketplace: {
    title: "Pazar | KomşuApp",
    description:
      "KomşuApp Pazar'da yerel ürün ve hizmetleri bulun. Komşularınızdan güvenilir ilan ve alışveriş imkanları.",
  },
  events: {
    title: "Etkinlikler | KomşuApp",
    description:
      "Mahallenizdeki etkinlikleri keşfedin ve katılın. Komşularınızla birlikte yapılacak etkinlikleri planlayın.",
  },
  groups: {
    title: "Gruplar | KomşuApp",
    description:
      "KomşuApp Grupları ile ilgi alanlarına göre komşuları birleştirin. Mahalle bazlı grup oluşturun ve yönetin.",
  },
  businesses: {
    title: "İşletmeler | KomşuApp",
    description:
      "Mahallenizdeki yerel işletmeleri keşfedin. Dükkân, resepsiyon, salon ve çok daha fazlası.",
  },
  search: {
    title: "Ara | KomşuApp",
    description:
      "KomşuApp'da komşuları, grupları, etkinlikleri ve ürünleri arayın.",
  },
  terms: {
    title: "Kullanım Koşulları | KomşuApp",
    description:
      "KomşuApp Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  },
  privacy: {
    title: "Gizlilik Politikası | KomşuApp",
    description:
      "KomşuApp Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
  cookies: {
    title: "Çerez Politikası | KomşuApp",
    description:
      "KomşuApp Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
  help: {
    title: "Yardım Merkezi | KomşuApp",
    description:
      "KomşuApp Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  },
  contact: {
    title: "İletişim | KomşuApp",
    description:
      "KomşuApp ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
  howitworks: {
    title: "Nasıl Çalışır? | KomşuApp",
    description:
      "KomşuApp nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  },
  communityRules: {
    title: "Topluluk Kuralları | KomşuApp",
    description:
      "KomşuApp Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
  security: {
    title: "Güvenlik | KomşuApp",
    description:
      "KomşuApp Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  careers: {
    title: "Kariyer | KomşuApp",
    description:
      "KomşuApp Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
  kvkk: {
    title: "KVKK | KomşuApp",
    description:
      "KomşuApp KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
  blog: {
    title: "Blog | KomşuApp",
    description:
      "KomşuApp Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  },
  discover: {
    title: "Keşfet | KomşuApp",
    description:
      "KomşuApp Keşfet. Mahallenizdeki yeni komşuları, etkinlikleri ve fırsatları keşfedin.",
  },
};
