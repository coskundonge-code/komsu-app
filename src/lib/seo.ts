import { Metadata } from "next";

export const BASE_URL = "https://mahallem.com";

export const DEFAULT_OG_IMAGE = {
  url: `${BASE_URL}/icon-512.png`,
  width: 512,
  height: 512,
  alt: "Mahallemiz Logo",
};

export const SEO_DEFAULTS = {
  title: {
    default: "Mahallemiz - Mahalleni Keşfet",
    template: "%s | Mahallemiz",
  },
  description:
    "Mahallemiz ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin. Türkiye'nin mahalle sosyal ağı.",
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
    siteName: "Mahallemiz",
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: "@mahallem",
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
    title: "Mahallemiz - Mahalleni Keşfet",
    description:
      "Mahallemiz ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin.",
  },
  about: {
    title: "Hakkında | Mahallemiz",
    description:
      "Mahallemiz hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin. Mahalle topluluklarını güçlendiren platform.",
  },
  marketplace: {
    title: "Pazar | Mahallemiz",
    description:
      "Mahallemiz Pazar'da yerel ürün ve hizmetleri bulun. Komşularınızdan güvenilir ilan ve alışveriş imkanları.",
  },
  events: {
    title: "Etkinlikler | Mahallemiz",
    description:
      "Mahallenizdeki etkinlikleri keşfedin ve katılın. Komşularınızla birlikte yapılacak etkinlikleri planlayın.",
  },
  groups: {
    title: "Gruplar | Mahallemiz",
    description:
      "Mahallemiz Grupları ile ilgi alanlarına göre komşuları birleştirin. Mahalle bazlı grup oluşturun ve yönetin.",
  },
  businesses: {
    title: "İşletmeler | Mahallemiz",
    description:
      "Mahallenizdeki yerel işletmeleri keşfedin. Dükkân, resepsiyon, salon ve çok daha fazlası.",
  },
  search: {
    title: "Ara | Mahallemiz",
    description:
      "Mahallemiz'de komşuları, grupları, etkinlikleri ve ürünleri arayın.",
  },
  terms: {
    title: "Kullanım Koşulları | Mahallemiz",
    description:
      "Mahallemiz Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  },
  privacy: {
    title: "Gizlilik Politikası | Mahallemiz",
    description:
      "Mahallemiz Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
  cookies: {
    title: "Çerez Politikası | Mahallemiz",
    description:
      "Mahallemiz Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
  help: {
    title: "Yardım Merkezi | Mahallemiz",
    description:
      "Mahallemiz Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  },
  contact: {
    title: "İletişim | Mahallemiz",
    description:
      "Mahallemiz ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
  howitworks: {
    title: "Nasıl Çalışır? | Mahallemiz",
    description:
      "Mahallemiz nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  },
  communityRules: {
    title: "Topluluk Kuralları | Mahallemiz",
    description:
      "Mahallemiz Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
  security: {
    title: "Güvenlik | Mahallemiz",
    description:
      "Mahallemiz Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  careers: {
    title: "Kariyer | Mahallemiz",
    description:
      "Mahallemiz Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
  kvkk: {
    title: "KVKK | Mahallemiz",
    description:
      "Mahallemiz KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
  blog: {
    title: "Blog | Mahallemiz",
    description:
      "Mahallemiz Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  },
  discover: {
    title: "Keşfet | Mahallemiz",
    description:
      "Mahallemiz Keşfet. Mahallenizdeki yeni komşuları, etkinlikleri ve fırsatları keşfedin.",
  },
  oduncKirala: {
    title: "Ödünç Ver & Kirala | Mahallemiz",
    description:
      "Mahallenizdeki komşularınızla eşya paylaşın. Matkap, testere, masa, sandalye gibi eşyaları ücretsiz ödünç verin veya saatlik/günlük kiralayın.",
  },
  mahallemKart: {
    title: "Mahallemiz Kart | Mahallemiz",
    description:
      "Dijital mahalle kartınızla yerel esnaflardan indirim kazanın, puan biriktirin ve askıda bağış yapın.",
  },
  askidaBagis: {
    title: "Askıda Bağış | Mahallemiz",
    description:
      "Askıda ekmek, et, süt, traş ve daha fazlası. Komşuna bir iyilik bırak, mahalleni güzelleştir.",
  },
};
