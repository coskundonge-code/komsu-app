export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mahallem",
    url: "https://mahallem.com",
    description:
      "Türkiye'nin mahalle sosyal ağı. Mahallem ile mahallenizdeki komşularınızla tanışın, haberleşin, alışveriş yapın, etkinliklere katılın ve yerel işletmeleri keşfedin.",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web",
    inLanguage: "tr",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
    author: {
      "@type": "Organization",
      name: "Mahallem",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
