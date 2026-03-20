'use client'

import { useState, useEffect } from 'react'
import { Camera, MapPin, AlertTriangle, ArrowRight, Newspaper, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { PostFormModal } from '@/components/feed/post-form-modal'
import StoriesBar from '@/components/feed/stories-bar'
import { getFeedImageUrl } from '@/lib/demo-images'
import { AddressVerificationBanner } from '@/components/feed/address-verification-banner'
import { FeedPostCard, POST_CATEGORIES, type FeedPostData } from '@/components/feed/post-card'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getPosts } from '@/lib/hooks/use-posts'

const feedTabs = [
  { id: 'foryou', label: 'Senin İçin' },
  { id: 'recent', label: 'Son Paylaşılanlar' },
  { id: 'nearby', label: 'Yakın Mahalleler' },
  { id: 'trending', label: 'Gündem' },
]

const mockPosts: FeedPostData[] = [
  { id: 'pinned-1', author: { name: 'Ibrahim M. (Muhtar)', initial: 'I', neighborhood: 'Kadıköy, Moda', profileId: 'ibrahim-muhtar' }, timeAgo: '3 sa', isSponsored: false, isPinned: true, category: 'guvenlik', title: 'Mahallede Şüpheli Faaliyet - Dikkat', body: 'Değerli mahalleli komşularımız, son iki haftada mahalle çeperinde bazı şüpheli hareketliler yaşanmıstır. Lütfen çevre dikkat edin ve yetkililerine haber veriniz.', image: getFeedImageUrl(100), reactions: 156, comments: 42, feed: 'foryou' },
  { id: '1', author: { name: 'Ayse K.', initial: 'A', neighborhood: 'Kadıköy, Moda', profileId: 'ayse-k' }, timeAgo: '2 dk', isSponsored: false, isPinned: false, category: 'etkinlikler', title: 'Mahalle Pikniği Bu Akşam!', body: 'Merhaba komşular, bu akşam saat 20:00\'de mahalle parkında piknik yapıyoruz. Katılmak isteyen herkesi bekliyoruz! Yanınıza battaniye ve atıştırmalık getirmeniz yeterli.', image: getFeedImageUrl(58), reactions: 24, comments: 8, feed: 'foryou' },
  { id: '2', author: { name: 'Mehmet Y.', initial: 'M', neighborhood: 'Kadıköy, Caferağa', profileId: 'mehmet-y' }, timeAgo: '1 sa', isSponsored: false, isPinned: false, category: 'kayipbuluntu', title: 'Kayıp Kedi - Turuncu Tekir', body: 'Pazartesi günü turuncu renkli kedim mahallede kayboldu. Adı Mismis, çok uysal ve evcil. Görürseniz lütfen haber verin.', image: getFeedImageUrl(59), reactions: 42, comments: 15, feed: 'recent' },
  { id: '3', author: { name: 'Fatma C.', initial: 'F', neighborhood: 'Kadıköy, Moda', profileId: 'fatma-c' }, timeAgo: '3 sa', isSponsored: false, isPinned: false, category: 'oneriler', title: 'Yeni Kafede Harika Çilekli Cheesecake!', body: 'Yeni açılan Moda Kafe\'yi denediniz mi? Kahveleri harika ve fiyatlar gayet makul. Bir denemenizi tavsiye ederim!', reactions: 18, comments: 5, feed: 'foryou' },
  { id: '4', author: { name: 'Emre D.', initial: 'E', neighborhood: 'Kadıköy, Moda', profileId: 'emre-d' }, timeAgo: '5 sa', isSponsored: false, isPinned: false, category: 'guvenlik', title: 'Mahallede Şüpheli Araç', b