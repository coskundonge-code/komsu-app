'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Check,
  Shield,
  Package,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getFeedImageUrl, getAvatarUrl } from 'A/lib/demo-images';
import { getListingById } from '@/lib/hooks/use-listings';

// Mock listings database - expanded with multiple variations
const mockListingsDB: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5 - 15.6 inç Full HD',
    price: 8500,
    condition: 'Az Kullanılmış',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Elektronik',
    categoryColor: 'bg-blue-100 text-blue-800',
    neighborhood: 'Moda',
    location: 'Moda, Kadıköy',
    timeAgo: '2 saat önce',
    views: 324,
    favorites: 45,
    description:
      'Lenovo IdeaPad 5 15.6" Full HD IPS ekran, Intel Core i5-1135G7, 8GB DDR4 RAM, 512GB SSD. Ç� az kullanılmıştır. Orijinal kutusu ve tüm aksesuarları mevcuttur. Garantisi 1 yıl kalmıştır. İyi bir laptop arayan kişiler için ideal. Sadece kişisel kullanım için alınmıştı.',
    images: [
      getFeedImageUrl(1, 800, 600),
      getFeedImageUrl(2, 800, 600),
      getFeedImageUrl(3, 800, 600),
      getFeedImageUrl(4, 800, 600),
    ],
    seller: {
      id: 'seller1',
      name: 'Mehmet Yılmaz',
      avatar: getFeedImageUrl(5, 200, 200),
      rating: 4.8,
      reviewCount: 23,
      responseTime: '< 1 saat',
      joinDate: '2 yıl önce',
      listings: 45,
      verified: true,
      soldCount: 42,
    },
    specs: [
      { label: 'İşlemci', value: 'Intel Core i5-1135G7' },
      { label: 'RAM', value: '8GB DDR4' },
      { label: 'Depolama', value: '512GB SSD' },
      { label: 'Ekran', value: '15.6" Full HD IPS' },
      { label: 'Batarya', value: '10 saat' },
      { label: 'Ağırlık', value: '1.6 kg' },
    ],
  },
  '2': {
    id: '2',
    title: 'IKEA Kanepe - Açık Gri Renk, Çok İ�i Durumda',
    price: 2200,
    condition: 'İ�i Durumda',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Mobilya',
    categoryColor: 'bg-purple-100 text-purple-800',
    neighborhood: 'Moda',
    location: 'Moda, Kadıköy',
    timeAgo: '4 saat önce',
    views: 156,
    favorites: 28,
    description:
      'IKEA Ektorp serisi 3 kişilik kanepe. Açık gri renk, harika durumda. Temiz, hiç hasarı yok. Çok konforlu oturuş. Kanepenin boyutları: Genişlik 242cm, Derinlik 88cm, Yýkseklik 88cm. Kapı altından kolaylıkla geçebilir. Kılıf-�
Ĵ èì
}}