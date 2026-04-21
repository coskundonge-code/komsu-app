import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata, BASE_URL } from '@/lib/seo';
import ListingDetailClient from './listing-detail-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('listings')
    .select('title, description, media_urls')
    .eq('id', id)
    .single();

  if (!data) {
    return generatePageMetadata({
      title: 'İlan Bulunamadı',
      description: 'Bu ilan mevcut değil veya kaldırılmış olabilir.',
    });
  }

  const title = data.title ?? 'İlan';
  const description =
    (data.description as string | null)?.substring(0, 155) ??
    'Mahallemiz Pazar\'da ikinci el eşya ilanı.';
  const firstImage = (data.media_urls as string[] | null)?.[0];

  return generatePageMetadata({
    title,
    description,
    openGraph: {
      url: `${BASE_URL}/pazar/ilan/${id}`,
      ...(firstImage ? { images: [{ url: firstImage, alt: title }] } : {}),
    },
  });
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ListingDetailClient id={id} />;
}
