import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;

  // Main landing and core feature pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/hakkinda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nasil-calisir`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Marketplace pages
  const marketplacePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pazar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/pazar/ilan-ver`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // Events pages
  const eventsPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/etkinlikler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/etkinlikler/olustur`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Community pages
  const communityPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/gruplar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/gruplar/olustur`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Business pages
  const businessPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/isletmeler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/isletme-ekle`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Discovery and content pages
  const contentPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/kesfet`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ara`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/favoriler`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
  ];

  // Authentication pages
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/giris`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kayit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/sifre-sifirla`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Legal and information pages
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/kosullar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/gizlilik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kvkk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/topluluk-kurallari`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/yardim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guvenlik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kariyer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Marketplace Categories — canlı listing_categories.slug ile birebir eşleşen gerçek
  // kategori sayfaları (eski liste mevcut olmayan slug'lara işaret ediyordu; ayrıca
  // /pazar/kategori index route'u yok → 404 olduğu için sitemap'ten çıkarıldı).
  const marketplaceCategorySlugs = [
    "arac",
    "bebek-cocuk",
    "diger",
    "elektronik",
    "ev-bahce",
    "giyim",
    "kitap-kirtasiye",
    "mobilya",
    "spor-hobi",
    "ucretsiz",
  ];
  const marketplaceCategoryPages: MetadataRoute.Sitemap = marketplaceCategorySlugs.map(
    (slug) => ({
      url: `${baseUrl}/pazar/kategori/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })
  );

  // Business Categories — canlı business_categories.slug ile birebir eşleşen
  // gerçek kategori sayfaları (eski liste mevcut olmayan slug'lara + var olmayan
  // /isletmeler/kategori index route'una işaret ediyordu → 404'ler çıkarıldı).
  const businessCategorySlugs = [
    "restoran-kafe",
    "market-bakkal",
    "saglik",
    "egitim",
    "guzellik-bakim",
    "tamirci-servis",
    "temizlik",
    "nakliyat",
    "hukuk-danismanlik",
    "emlak",
    "evcil-hayvan",
    "diger-isletme",
  ];
  const businessCategoryPages: MetadataRoute.Sitemap = businessCategorySlugs.map(
    (slug) => ({
      url: `${baseUrl}/isletmeler/kategori/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })
  );

  // Combine all pages
  return [
    ...mainPages,
    ...marketplacePages,
    ...eventsPages,
    ...communityPages,
    ...businessPages,
    ...contentPages,
    ...authPages,
    ...legalPages,
    ...marketplaceCategoryPages,
    ...businessCategoryPages,
  ];
}
