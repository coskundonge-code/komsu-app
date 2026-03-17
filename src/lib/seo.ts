import { Metadata } from "next";

export const BASE_URL = "https://mahallem.com";

export const DEFAULT_OG_IMAGE = {
  url: `${BASE_URL}/icon-512.png`,
  width: 512,
  height: 512,
  alt: "Mahallem Logo",
};

export const SEO_DEFAULTS = {
  title: {
    default: "Mahallem - Mahalleni Keşfet",
    template: "%s | Mahallem",
  },
  description:
    "Mahallem ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin. Türkiye'nin mahalle sosyal ağı.",
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
    siteName: "Mahallem",
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
    title: "Mahallem - Mahalleni Keşfet",
    description:
      "Mahallem ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın ve birlikte etkinlikler düzenleyin.",
  },
  about: {
    title: "Hakkında | Mahallem",
    description:
      "Mahallem hakkında, misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin. Mahalle topluluklarını güçlendiren platform.",
  },
  marketplace: {
    title: "Pazar | Mahallem",
    description:
      "Mahallem Pazar'da yerel ürün ve hizmetleri bulun. Komşularınızdan güvenilir ilan ve alışveriş imkanları.",
  },
  events: {
    title: "Etkinlikler | Mahallem",
    description:
      "Mahallenizdeki etkinlikleri keşfedin ve katılın. Komşularınızla birlikte yapılacak etkinlikleri planlayın.",
  },
  groups: {
    title: "Gruplar | Mahallem",
    description:
      "Mahallem Grupları ile ilgi alanlarına göre komşuları birleştirin. Mahalle bazlı grup oluşturun ve yönetin.",
  },
  businesses: {
    title: "İşletmeler | Mahallem",
    description:
      "Mahallenizdeki yerel işletmeleri keşfedin. Dükkân, resepsiyon, salon ve çok daha fazlası.",
  },
  search: {
    title: "Ara | Mahallem",
    description:
      "Mahallem'de komşuları, grupları, etkinlikleri ve ürünleri arayın.",
  },
  terms: {
    title: "Kullanım Koşulları | Mahallem",
    description:
      "Mahallem Kullanım Koşulları. Hizmetlerimizi kullanırken uymanız gereken kuralları öğrenin.",
  },
  privacy: {
    title: "Gizlilik Politikası | Mahallem",
    description:
      "Mahallem Gizlilik Politikası. Verileriniz nasıl korunduğunu ve kullanıldığını öğrenin.",
  },
  cookies: {
    title: "Çerez Politikası | Mahallem",
    description:
      "Mahallem Çerez Politikası. Çerezlerin nasıl kullanıldığını ve ayarlarınızı nasıl yönetebileceğinizi öğrenin.",
  },
  help: {
    title: "Yardım Merkezi | Mahallem",
    description:
      "Mahallem Yardım Merkezi. Sık sorulan sorulara ve destek kaynağına erişin.",
  },
  contact: {
    title: "İletişim | Mahallem",
    description:
      "Mahallem ile iletişime geçin. Sorular, öneriler ve destek için bize yazın.",
  },
  howitworks: {
    title: "Nasıl Çalışır? | Mahallem",
    description:
      "Mahallem nasıl çalışıyor öğrenin. Adım adım rehberimizi izleyin ve başlayın.",
  },
  communityRules: {
    title: "Topluluk Kuralları | Mahallem",
    description:
      "Mahallem Topluluk Kuralları. Güvenli ve saygılı bir topluluk oluşturmak için bizimle yapın.",
  },
  security: {
    title: "Güvenlik | Mahallem",
    description:
      "Mahallem Güvenlik. Hesabınızı nasıl koruyabileceğinizi ve güvenli kalabileceğinizi öğrenin.",
  },
  careers: {
    title: "Kariyer | Mahallem",
    description:
      "Mahallem Kariyer. Ekibimize katılın ve mahalle topluluklarını güçlendirmeye yardımcı olun.",
  },
  kvkk: {
    title: "KVKK | Mahallem",
    description:
      "Mahallem KVKK Aydınlatma Metni. Kişisel verilerinizin korunması hakkında bilgi edinin.",
  },
  blog: {
    title: "Blog | Mahallem",
    description:
      "Mahallem Blog. Mahalle hayatı, komşuluk ve yerel topluluklar hakkında yazılar.",
  },
  discover: {
    title: "Keşfet | Mahallem",
    description:
      "Mahallem Keşfet. Mahallenizdeki yeni komşuları, etkinlikleri ve fırsatları keşfedin.",
  },
  oduncKirala: {
    title: "Ödünç Ver & Kirala | Mahallem",
    description:
      "Mahallenizdeki komşularınızla eşya paylaşın. Matkap, testere, masa, sandalye gibi eşyaları ücretsiz ödünç verin veya saatlik/günlük kiralayın.",
  },
  mahallemKart: {
    title: "Mahallem Kart | Mahallem",
    description:
      "Dijital mahalle kartınızla yerel esnaflardan indirim kazanın, puan biriktirin ve askıda bağış yapın.",
  },
  askidaBagis: {
    title: "Askıda Bağış | Mahallem",
    description:
      "Askıda ekmek, et, süt, traş ve daha fazlası. Komşuna bir iyilik bırak, mahalleni güzelleştir.",
  },
};
