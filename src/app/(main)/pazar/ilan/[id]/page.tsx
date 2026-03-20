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
import { getFeedImageUrl, getAvatarUrl } from '@/lib/demo-images';
import { getListingById } from '@/lib/hooks/use-listings';

// Mock listings database - expanded with multiple variations
const mockListingsDB: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Laptop Lenovo IdeaPad 5 - 15.6 inÃ§ Full HD',
    price: 8500,
    condition: 'Az KullanÄ±lmÄ±ÅŸ',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Elektronik',
    categoryColor: 'bg-blue-100 text-blue-800',
    neighborhood: 'Moda',
    location: 'Moda, KadÄ±kÃ¶y',
    timeAgo: '2 saat Ã¶nce',
    views: 324,
    favorites: 45,
    description:
      'Lenovo IdeaPad 5 15.6" Full HD IPS ekran, Intel Core i5-1135G7, 8GB DDR4 RAM, 512GB SSD. Ã‡ok az kullanÄ±lmÄ±ÅŸtÄ±r. Orijinal kutusu ve tÃ¼m aksesuarlarÄ± mevcuttur. Garantisi 1 yÄ±l kalmÄ±ÅŸtÄ±r. Ä°yi bir laptop arayan kiÅŸiler iÃ§in ideal. Sadece kiÅŸisel kullanÄ±m iÃ§in alÄ±nmÄ±ÅŸtÄ±.',
    images: [
      getFeedImageUrl(1, 800, 600),
      getFeedImageUrl(2, 800, 600),
      getFeedImageUrl(3, 800, 600),
      getFeedImageUrl(4, 800, 600),
    ],
    seller: {
      id: 'seller1',
      name: 'Mehmet YÄ±lmaz',
      avatar: getFeedImageUrl(5, 200, 200),
      rating: 4.8,
      reviewCount: 23,
      responseTime: '< 1 saat',
      joinDate: '2 yÄ±l Ã¶nce',
      listings: 45,
      verified: true,
      soldCount: 42,
    },
    specs: [
      { label: 'Ä°ÅŸlemci', value: 'Intel Core i5-1135G7' },
      { label: 'RAM', value: '8GB DDR4' },
      { label: 'Depolama', value: '512GB SSD' },
      { label: 'Ekran', value: '15.6" Full HD IPS' },
      { label: 'Batarya', value: '10 saat' },
      { label: 'AÄŸÄ±rlÄ±k', value: '1.6 kg' },
    ],
  },
  '2': {
    id: '2',
    title: 'IKEA Kanepe - AÃ§Ä±k Gri Renk, Ã‡ok Ä°yi Durumda',
    price: 2200,
    condition: 'Ä°yi Durumda',
    conditionBadgeColor: 'bg-green-100 text-green-800',
    category: 'Mobilya',
    categoryColor: 'bg-purple-100 text-purple-800',
    neighborhood: 'Moda',
    location: 'Moda, KadÄ±kÃ¶y',
    timeAgo: '4 saat Ã¶nce',
    views: 156,
    favorites: 28,
    description:
      'IKEA Ektorp serisi 3 kiÅŸilik kanepe. AÃ§Ä±k gri renk, harika durumda. Temiz, hiÃ§ hasarÄ± yok. Ã‡ok konforlu oturuÅŸ. Kanepenin boyutlarÄ±: GeniÅŸlik 242cm, Derinlik 88cm, YÃ¼kseklik 88cm. KapÄ± altÄ±ndan kolaylÄ±kla geÃ§ebilir. KÄ±lÄ±fÄ±,Ã§Ä±k arÄ±labilir ve yÄ±kanabilir.',
    images: [
      getFeedImageUrl(6, 800, 600),
      getFeedImageUrl(7, 800, 600),
      getFeedImageUrl(8, 800, 600),
    ],
    seller: {
      id: 'seller2',
      name: 'AyÅŸe Kaya',
      avatar: getFeedImageUrl(9, 200, 200),
      rating: 4.9,
      reviewCount: 18,
    €É•ÍÁ½¹Í•Q¥µ”è€œð€ÌÀ‘…­¥­„œ°(€€€€€©½¥¹…Ñ”è€œÄçÅ°ƒÙ¹”œ°(€€€€€±¥ÍÑ¥¹Ìè€ÌÈ°(€€€€€Ù•É¥™¥•èÑÉÕ”°(€€€€€Í½±‘½Õ¹Ðè€ÌÀ°(€€€ô°(€€€ÍÁ•Ìèl(€€€€€ì±…‰•°è€•¹§}±¥¬œ°Ù…±Õ”è€œÈÐÈ´œô°(€€€€€ì±…‰•°è€•É¥¹±¥¬œ°Ù…±Õ”è€œàà´œô°(€€€€€ì±…‰•°è€gñ­Í•­±¥¬œ°Ù…±Õ”è€œàà´œô°(€€€€€ì±…‰•°è€I•¹¬œ°Ù…±Õ”è€ŸÅ¬É¤œô°(€€€€€ì±…‰•°è€5½‘•°œ°Ù…±Õ”è€­Ñ½ÉÀM•É¥Í¤œô°(€€€€€ì±…‰•°è€/Å³Å˜œ°Ù…±Õ”è€ŸÅ­…ËÅ±…‰¥±¥Èœô°(€€€t°(€ô°(€€œÌœèì(€€€¥è€œÌœ°(€€€Ñ¥Ñ±”è€A±…åMÑ…Ñ¥½¸€Ô€´=É©¥¹…°-ÕÑÔ¥±”M…ÓÅ³Åå½Èœ°(€€€ÁÉ¥”è€ØÔÀÀ°(€€€½¹‘¥Ñ¥½¸è€OÅ›ÅÈœ°(€€€½¹‘¥Ñ¥½¹	…‘•½±½Èè€‰œµÉ••¸´ÄÀÀÑ•áÐµÉ••¸´àÀÀœ°(€€€…Ñ•½Éäè€±•­ÑÉ½¹¥¬œ°(€€€…Ñ•½Éå½±½Èè€‰œµ‰±Õ”´ÄÀÀÑ•áÐµ‰±Õ”´àÀÀœ°(€€€¹•¥¡‰½É¡½½è€•¹•É‰…£”œ°(€€€±½…Ñ¥½¸è€•¹•É‰…£”°-…“Å¯Ùäœ°(€€€Ñ¥µ•¼è€œÄŸñ¸ƒÙ¹”œ°(€€€Ù¥•ÝÌè€àäÈ°(€€€™…Ù½É¥Ñ•Ìè€ÄÔØ°(€€€‘•ÍÉ¥ÁÑ¥½¸è(€€€€€€A±…åMÑ…Ñ¥½¸€Ô°½É©¥¹…°­ÕÑÕÍÕ¹‘„°¡§œ­Õ±±…»Å±µ…·Ç|°Ù¥¹¥°Í•…±¥å±”Á…­•Ñ±¤¸M…ÓÇ|‰•±•Í¤Ù”€ÈçÅ³Å¬…É…¹Ñ¥Í¤µ•ÙÕÑÑÕÈ¸ƒ½¬¹…‘¥È‰Õ±Õ¹ÕÈ‰Ô­¿}Õ±‘„¸Sñ´­½¹ÑÉ½±±•Èå…ÃÅ±·Ç}ÓÅÈ¸¥°Á…É„¥¡Ñ¥å…Ä¹•‘•¹¥å±”Í…ÓÅ³Åå½È¸±‘•¸Ñ•Í±¥´Ñ•É¥ •‘¥±¥È¸Q•ÍÑ¥¹¤çñèçñé”å…Á…‰¥±¥ÉÍ¥¹¥è¸œ°(€€€¥µ…•Ìèl(€€€€€•Ñ••‘%µ…•UÉ° ÄÀ°€àÀÀ°€ØÀÀ¤°(€€€€€•Ñ••‘%µ…•UÉ° ÄÄ°€àÀÀ°€ØÀÀ¤°(€€€€€•Ñ••‘%µ…•UÉ° ÄÈ°€àÀÀ°€ØÀÀ¤°(€€€t°(€€€Í•±±•Èèì(€€€€€¥è€Í•±±•ÈÌœ°(€€€€€¹…µ”è€5•ÉÐ•µ¥Èœ°(€€€€€…Ù…Ñ…Èè•Ñ••‘%µ…•UÉ° ÄÌ°€ÈÀÀ°€ÈÀÀ¤°(€€€€€É…Ñ¥¹œè€Ð¸Ü°(€€€€€É•Ù¥•Ý½Õ¹Ðè€ÄÈ°(€€€€€É•ÍÁ½¹Í•Q¥µ”è€œð€ÈÍ……Ðœ°(€€€€€©½¥¹…Ñ”è€œØ…äƒÙ¹”œ°(€€€€€±¥ÍÑ¥¹Ìè€à°(€€€€€Ù•É¥™¥•è™…±Í”°(€€€€€Í½±‘½Õ¹Ðè€Ü°(€€€ô°(€€€ÍÁ•Ìèl(€€€€€ì±…‰•°è€5½‘•°œ°Ù…±Õ”è€ALÔMÑ…¹‘…É‘¥Ñ¥½¸œô°(€€€€€ì±…‰•°è€ÕÉÕ´œ°Ù…±Õ”è€OÅ›ÅÈ€´ŸÅ±µ…·Ç|œô°(€€€€€ì±…‰•°è€­Í•ÍÕ…Èœ°Ù…±Õ”è€Sñ´½É¥©¥¹…°…­Í•ÍÕ…ÈÙ”½åÕ¸€¬­½°œô°(€€€€€ì±…‰•°è€…É…¹Ñ¥Í¤œ°Ù…±Õ”è€œÈçÅ°­…±…¸œô°(€€€€€ì±…‰•°è€M…ÓÇ|	•±•Í¤œ°Ù…±Õ”è€5•ÙÕÑÑÕÈœô°(€€€t°(€ô°)ôì()•áÁ½ÉÐ‘•™…Õ±Ð™Õ¹Ñ¥½¸1¥ÍÑ¥¹•Ñ…¥±A…”¡ì(€Á…É…µÌ°)ôèì(€Á…É…µÌèì¥èÍÑÉ¥¹œôì)ô¤ì(€½¹ÍÐmµ½­1¥ÍÑ¥¹œ°Í•Ñ5½­1¥ÍÑ¥¹t€ôÕÍ•MÑ…Ñ”¡µ½­1¥ÍÑ¥¹Í	mÁ…É…µÌ¹¥‘tñðµ½­1¥ÍÑ¥¹Í	lœÄt¤ì(€½¹ÍÐm±½…‘¥¹œ°Í•Ñ1½…‘¥¹t€ôÕÍ•MÑ…Ñ”¡ÑÉÕ”¤ì(€½¹ÍÐmÕÉÉ•¹Ñ%µ…•%¹‘•à°Í•ÑÕÉÉ•¹Ñ%µ…•%¹‘•át€ôÕÍ•MÑ…Ñ” À¤ì(€½¹ÍÐm¥Í…Ù½É¥Ñ”°Í•Ñ%Í…Ù½É¥Ñ•t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐmÍ¡½ÝM¡…É•5•¹Ô°Í•ÑM¡½ÝM¡…É•5•¹Õt€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì((€ÕÍ•™™•Ð  ¤€ôøì(€€€½¹ÍÐ™•Ñ¡1¥ÍÑ¥¹œ€ô…Íå¹Œ€ ¤€ôøì(€€€€€ÑÉäì(€€€€€€€Í•Ñ1½…‘¥¹œ¡ÑÉÕ”¤ì(€€€€€€€½¹ÍÐì‘…Ñ„°•ÉÉ½Èô€ô…Ý…¥Ð•Ñ1¥ÍÑ¥¹	å%¡Á…É…µÌ¹¥¤ì((€€€€€€€¥˜€¡•ÉÉ½È¤ì(€€€€€€€€€½¹Í½±”¹Ý…É¸ ÉÉ½È™•Ñ¡¥¹œ±¥ÍÑ¥¹œ°ÕÍ¥¹œµ½¬‘…Ñ„èœ°•ÉÉ½È¤ì(€€€€€€€€€Í•Ñ5½­1¥ÍÑ¥¹œ¡µ½­1¥ÍÑ¥¹Í	mÁ…É…µÌ¹¥‘tñðµ½­1¥ÍÑ¥¹Í	lœÄt¤ì(€€€€€€€ô•±Í”¥˜€¡‘…Ñ„¤ì(€€€€€€€€€€¼¼5…À™¥•±‘ÌÑ¼U$™½Éµ…Ð€´•¹¡…¹•‘•Ñ…¥°Á…”(€€€€€€€€€½¹ÍÐ±¥ÍÑ¥¹œ€ôì(€€€€€€€€€€€¥è€¡‘…Ñ„…Ì…¹ä¤¹¥°(€€€€€€€€€€€Ñ¥Ñ±”è€¡‘…Ñ„…Ì…¹ä¤¹Ñ¥Ñ±”°(€€€€€€€€€€€ÁÉ¥”è€¡‘…Ñ„…Ì…¹ä¤¹ÁÉ¥”ñð€À°(€€€€€€€€€€€½¹‘¥Ñ¥½¸è€¡‘…Ñ„…Ì…¹ä¤¹¥Ñ•µ}½¹‘¥Ñ¥½¸ñð€½½œ°(€€€€€€€€€€€½¹‘¥Ñ¥½¹	…‘•½±½Èè€‰œµÉ••¸´ÄÀÀÑ•áÐµÉ••¸´àÀÀœ°(€€€€€€€€€€€…Ñ•½Éäè€¡‘…Ñ„…Ì…¹ä¤¹±¥ÍÑ¥¹}…Ñ•½É¥•Ìü¹¹…µ”ñð€§}•Èœ°(€€€€€€€€€€€…Ñ•½Éå½±½Èè€‰œµ‰±Õ”´ÄÀÀÑ•áÐµ‰±Õ”´àÀÀœ°(€€€€€€€€€€€¹•¥¡‰½É¡½½è€¡‘…Ñ„…Ì…¹ä¤¹¹•¥¡‰½É¡½½ñð€	¥±¥¹µ¥å½Èœ°(€€€€€€€€€€€±½…Ñ¥½¸è€¡‘…Ñ„…Ì…¹ä¤¹¹•¥¡‰½É¡½½ñð€	¥±¥¹µ¥å½Èœ°(€€€€€€€€€€€Ñ¥µ•¼è€¡‘…Ñ„…Ì…¹ä¤¹É•…Ñ•‘}…Ð€ü™½Éµ…ÑQ¥µ•¼¡¹•Ü…Ñ” ¡‘…Ñ„…Ì…¹ä¤¹É•…Ñ•‘}…Ð¤¤€è€œÄÍ……Ðœ°(€€€€€€€€€€€Ù¥•ÝÌè€ÌÈÐ°(€€€€€€€€€€€™…Ù½É¥Ñ•Ìè€ÐÔ°(€€€€€€€€€€€‘•ÍÉ¥ÁÑ¥½¸è€¡‘…Ñ„…Ì…¹ä¤¹‘•ÍÉ¥ÁÑ¥½¸ñð€œœ°(€€€€€€€€€€€¥µ…•Ìè€¡‘…Ñ„…Ì…¹ä¤¹¥µ…•}ÕÉ°ül¡‘…Ñ„…Ì…¹ä¤¹¥µ…•}ÕÉ±t€èm•Ñ••‘%µ…•UÉ° Ä°€àÀÀ°€ØÀÀ¥t°(€€€€€€€€€€€Í•±±•Èèì(€€€€€€€€€€€€€¥è€¡‘…Ñ„…Ì…¹ä¤¹ÁÉ½™¥±•Ìü¹¥ñð€Í•±±•ÈÄœ°(€€€€€€€€€€€€€¹…µ”è€¡‘…Ñ„…Ì…¹ä¤¹ÁÉ½™¥±•Ìü¹™Õ±±}¹…µ”ñð€	¥±¥¹µ¥å½Èœ°(€€€€€€€€€€€€€…Ù…Ñ…Èè€¡‘…Ñ„…Ì…¹ä¤¹ÁÉ½™¥±•Ìü¹…Ù…Ñ…É}ÕÉ°ñð•Ñ••‘%µ…•UÉ° Ô°€ÈÀÀ°€ÈÀÀ¤°(€€€€€€€€€€€€€É…Ñ¥¹œè€Ð¸à°(€€€€€€€€€€€€€É•Ù¥•Ý½Õ¹Ðè€ÈÌ°(€€€€€€€€€€€€€É•ÍÁ½¹Í•Q¥µ”è€œð€ÄÍ……Ðœ°(€€€€€€€€€€€€€©½¥¹…Ñ”è€œÈçÅ°ƒÙ¹”œ°(€€€€€€€€€€€€€±¥ÍÑ¥¹Ìè€ÐÔ°(€€€€€€€€€€€€€Ù•É¥™¥•èÑÉÕ”°(€€€€€€€€€€€€€Í½±‘½Õ¹Ðè€ÐÈ°(€€€€€€€€€€€ô°(€€€€€€€€€€€ÍÁ•Ìèl(€€€€€€€€€€€€€ì±…‰•°è€-…Ñ•½É¤œ°Ù…±Õ”è€¡‘…Ñ„…Ì…¹ä¤¹±¥ÍÑ¥¹}…Ñ•½É¥•Ìü¹¹…µ”ñð€§}•Èœô°(€€€€€€€€€€€€€ì±…‰•°è€ÕÉÕ´œ°Ù…±Õ”è€¡‘…Ñ„…Ì…¹ä¤¹¥Ñ•µ}½¹‘¥Ñ¥½¸ñð€½½œô°(€€€€€€€€€€€t°(€€€€€€€€€ôì(€€€€€€€€€Í•Ñ5½­1¥ÍÑ¥¹œ¡±¥ÍÑ¥¹œ¤ì(€€€€€€€ô•±Í”ì(€€€€€€€€€Í•Ñ5½­1¥ÍÑ¥¹œ¡µ½­1¥ÍÑ¥¹Í	mÁ…É…µÌ¹¥‘tñðµ½­1¥ÍÑ¥¹Í	lœÄt¤ì(€€€€€€€ô(€€€€€ô…Ñ €¡•ÉÈ¤ì(€€€€€€€½¹Í½±”¹•ÉÉ½È ÉÉ½È™•Ñ¡¥¹œ±¥ÍÑ¥¹œèœ°•ÉÈ¤ì(€€€€€€€Í•Ñ5½­1¥ÍÑ¥¹œ¡µ½­1¥ÍÑ¥¹Í	mÁ…É…µÌ¹¥‘tñðµ½­1¥ÍÑ¥¹Í	lœÄt¤ì(€€€€€ô™¥¹…±±äì(€€€€€€€Í•Ñ1½…‘¥¹œ¡™…±Í”¤ì(€€€€€ô(€€€ôì((€€€™•Ñ¡1¥ÍÑ¥¹œ ¤ì(€ô°mÁ…É…µÌ¹¥‘t¤ì((€½¹ÍÐ™½Éµ…ÑQ¥µ•¼€ô€¡‘…Ñ”è…Ñ”¤èÍÑÉ¥¹œ€ôøì(€€€½¹ÍÐ¹½Ü€ô¹•Ü…Ñ” ¤ì(€€€½¹ÍÐ‘¥™™5Ì€ô¹½Ü¹•ÑQ¥µ” ¤€´‘…Ñ”¹•ÑQ¥µ” ¤ì(€€€½¹ÍÐ‘¥™™!½ÕÉÌ€ô5…Ñ ¹™±½½È¡‘¥™™5Ì€¼€ÌØÀÀÀÀÀ¤ì(€€€½¹ÍÐ‘¥™™…åÌ€ô5…Ñ ¹™±½½È¡‘¥™™5Ì€¼€àØÐÀÀÀÀÀ¤ì((€€€¥˜€¡‘¥™™!½ÕÉÌ€ð€ÈÐ¤É•ÑÕÉ¸€‘í‘¥™™!½ÕÉÍôÍ……ÐƒÙ¹•€ì(€€€¥˜€¡‘¥™™…åÌ€ð€ÌÀ¤É•ÑÕÉ¸€‘í‘¥™™…åÍôŸñ¸ƒÙ¹•€ì(€€€É•ÑÕÉ¸€‘í5…Ñ ¹™±½½È¡‘¥™™…åÌ€¼€ÌÀ¥ô…äƒÙ¹•€ì(€ôì((€½¹ÍÐÁÉ•Ù%µ…”€ô€ ¤€ôøì(€€€Í•ÑÕÉÉ•¹Ñ%µ…•%¹‘•à (€€€€€€¡ÁÉ•Ø¤€ôø(€€€€€€€€¡ÁÉ•Ø€´€Ä€¬µ½­1¥ÍÑ¥¹œ¹¥µ…•Ì¹±•¹Ñ ¤€”µ½­1¥ÍÑ¥¹œ¹¥µ…•Ì¹±•¹Ñ (€€€€¤ì(€ôì((€½¹ÍÐ¹•áÑ%µ…”€ô€ ¤€ôøì(€€€Í•ÑÕÉÉ•¹Ñ%µ…•%¹‘•à (€€€€€€¡ÁÉ•Ø¤€ôø€¡ÁÉ•Ø€¬€Ä¤€”µ½­1¥ÍÑ¥¹œ¹¥µ…•Ì¹±•¹Ñ (€€€€¤ì(€ôì((€½¹ÍÐÍ¥µ¥±…É1¥ÍÑ¥¹Ì€ôl(€€€ì(€€€€€¥è€œÐœ°(€€€€€Ñ¥Ñ±”è€•±°%¹ÍÁ¥É½¸€ÄÔ€´e•¹¤5½‘•°œ°(€€€€€ÁÉ¥”è€ÜÈÀÀ°(€€€€€¥µ…”è(€€€€€€€•Ñ••‘%µ…•UÉ° ÄÐ°€ÔÀÀ°€ÔÀÀ¤°(€€€€€±½…Ñ¥½¸è€Ÿy§}±¤œ°(€€€€€Ñ¥µ•¼è€œÌÍ……Ðœ°(€€€€€¥ÍÉ•”è™…±Í”°(€€€ô°(€€€ì(€€€€€¥è€œÔœ°(€€€€€Ñ¥Ñ±”è€!@A…Ù¥±¥½¸€´€ÄÌ¥»œU±ÑÉ…‰½½¬œ°(€€€€€ÁÉ¥”è€ØàÀÀ°(€€€€€¥µ…”è(€€€€€€€•Ñ••‘%µ…•UÉ° ÄÔ°€ÔÀÀ°€ÔÀÀ¤°(€€€€€±½…Ñ¥½¸è€Q…­Í¥´œ°(€€€€€Ñ¥µ•¼è€œÔÍ……Ðœ°(€€€€€¥ÍÉ•”è™…±Í”°(€€€ô°(€€€ì(€€€€€¥è€œØœ°(€€€€€Ñ¥Ñ±”è€ÍÕÌY¥Ù½	½½¬€ÄÔ€´ƒÁ¤¥å…Ðœ°(€€€€€ÁÉ¥”è€ÔäÀÀ°(€€€€€¥µ…”è(€€€€€€€•Ñ••‘%µ…•UÉ° ÄØ°€ÔÀÀ, 500),
      location: 'BeÅŸiktaÅŸ',
      timeAgo: '6 saat',
      isFree: false,
    },
    {
      id: '7',
      title: 'MacBook Air M1 - 2023',
      price: 12500,
      image:
        getFeedImageUrl(17, 500, 500),
      location: 'NiÅŸantaÅŸÄ±',
      timeAgo: '1 gÃ¼n',
      isFree: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e0e0e0] shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/pazar"
            className="flex items-center gap-2 text-[#00833e] hover:text-[#006b32] font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Pazara DÃ¶n</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title={isFavorite ? 'Favorilerden Ã§Ä±kar' : 'Favorilere ekle'}
            >
              <Heart
                size={24}
                className={cn(
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-[#404040]'
                )}
              />
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-full hover:bg-[#f0f2f5] transition-colors"
              title="PaylaÅŸ"
            >
              <Share2 size={24} className="text-[#404040]" />
            </button>
          </div>
        </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="bg-white border-t border-[#e0e0e0] px-4 py-3">
            <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                WhatsApp'ta PaylaÅŸ
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                BaÄŸlantÄ±yÄ± Kopyala
              </button>
              <button className="px-4 py-2 bg-[#f0f2f5] rounded-full text-sm font-medium text-[#404040] hover:bg-[#e0e0e0] transition-colors">
                Facebook'ta PaylaÅŸ
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden">
            {/* Main Image */}
            <div className="relative bg-[#f0f2f5] aspect-square overflow-hidden group">
              <Image
                src={mockListing.images[currentImageIndex]}
                alt={mockListing.title}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                {currentImageIndex + 1} / {mockListing.images.length}
              </div>

              {/* Image Navigation Buttons */}
              {mockListing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    title="Ã–nceki resim"
                  >
                    <ChevronLeft size={24} className="text-[#333]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    title="Sonraki resim"
                  >
                    <ChevronRight size={24} className="text-[#333]" />
                  </button>
                </>
              )}

              {/* Views Badge */}
              <div className="absolute top-4 left-4 bg-white/90 text-[#333] px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                <Eye size={16} />
                {mockListing.views} gÃ¶rÃ¼ntÃ¼leme
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {mockListing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-[#f0f2f5] border-t border-[#e0e0e0]">
                {mockListing.images.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:border-[#00833e] relative',
                      currentImageIndex === idx
                        ? 'border-[#00833e] ring-2 ring-[#00833e] ring-offset-1'
                        : 'border-[#e0e0e0]'
                    )}
                    title={`Resim ${idx + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#333] mb-3">
                  {mockListing.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      mockListing.conditionBadgeColor
                    )}
                  >
                    {mockListing.condition}
                  </span>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      mockListing.categoryColor
                    )}
                  >
                    {mockListing.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-[#00833e]">
                  â‚º{mockListing.price.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e0e0e0]">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">Konum</p>
                  <p className="text-sm font-medium text-[#333]">
                    {mockListing.neighborhood}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-[#8f8f8f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#8f8f8f]">Ä°lan Tarihi</p>
                  <p className="text-sm font-medium text-[#333]">
                    {mockListing.timeAgo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-xl font-bold text-[#333] mb-4">AÃ§Ä±klama</h2>
            <p className="text-[#404040] leading-relaxed whitespace-pre-wrap">
              {mockListing.description}
            </p>
          </div>

          {/* Specifications */}
          {mockListing.specs && mockListing.specs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-xl font-bold text-[#333] mb-4">
                Ã–zellikleri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mockListing.specs.map((spec: { label: string; value: string }, idx: number) => (
                  <div key={idx}>
                    <p className="text-sm text-[#8f8f8f] mb-1.5 font-medium">
                      {spec.label}
                    </p>
                    <p className="text-base font-semibold text-[#333]">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Tips Card */}
          <div className="bg-blue-50 border-l-4 border-[#00833e] rounded-lg p-6">
            <div className="flex gap-3">
              <Shield size={24} className="text-[#00833e] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#333] mb-2">GÃ¼venli Ä°ÅŸlem Ä°puÃ§larÄ±</h3>
                <ul className="space-y-1 text-sm text-[#404040]">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>ÃœrÃ¼nÃ¼, satÄ±cÄ± ile kargo/kiÅŸisel teslimat Ã¶ncesi yÃ¼z yÃ¼ze gÃ¶rÃ¼n ve kontrol edin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Ã–deme iÅŸlemini Ã¼rÃ¼nÃ¼ kontrol ettikten sonra yapÄ±n</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Para transferi yapmadan kargo Ã¶demesi seÃ§eneÄŸini kullanmaya Ã§alÄ±ÅŸÄ±n</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Bilinmeyen kiÅŸilere Ã¶nceden para gÃ¶ndermeyin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
            <h2 className="text-lg font-bold text-[#333] mb-4">Ä°lan Ä°statistikleri</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">GÃ¶rÃ¼ntÃ¼leme</p>
                <p className="text-2xl font-bold text-[#333]">{mockListing.views}</p>
              </div>
              <div className="bg-[#f0f2f5] rounded-lg p-4">
                <p className="text-xs text-[#8f8f8f] mb-1">Kaydedilme</p>
                <p className="text-2xl font-bold text-[#00833e]">{mockListing.favorites}</p>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          <div>
            <h2 className="text-lg font-bold text-[#333] mb-4">Benzer Ä°lanlar</h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4">
                {similarListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/pazar/ilan/${listing.id}`}
                    className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-48 group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f0f2f5]">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                        {listing.timeAgo}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-lg font-bold text-[#333] mb-1">
                        â‚º{listing.price.toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-[#404040] line-clamp-2 mb-2">
                        {listing.title}
                      </p>
                      <p className="text-xs text-[#8f8f8f]">
                        {listing.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Seller Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
              <h3 className="text-lg font-bold text-[#333] mb-4">SatÄ±cÄ± Bilgisi</h3>

              {/* Seller Profile */}
              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                <Image
                  src={mockListing.seller.avatar}
                  alt={mockListing.seller.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[#333]">
                      {mockListing.seller.name}
                    </p>
                    {mockListing.seller.verified && (
                      <Check size={16} className="text-[#00833e]" />
                    )}
                  </div>
                  <p className="text-xs text-[#8f8f8f]">
                    {mockListing.seller.joinDate} katÄ±ldÄ±
                  </p>
                </div>
              </div>

              {/* Seller Stats */}
              <div className="space-y-3 mb-5 pb-5 border-b border-[#e0e0e0]">
                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Puan</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={cn(
                            i < Math.floor(mockListing.seller.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : i < mockListing.seller.rating
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-[#e0e0e0]'
                          )}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-[#333]">
                      {mockListing.seller.rating}
                    </p>
                    <p className="text-xs text-[#8f8f8f]">
                      ({mockListing.seller.reviewCount} yorum)
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Tepki SÃ¼resi</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.responseTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">Ä°lan SayÄ±sÄ±</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.listings} aktif ilan
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8f8f8f] mb-1">SatÄ±lan ÃœrÃ¼n</p>
                  <p className="font-semibold text-[#333]">
                    {mockListing.seller.soldCount} baÅŸarÄ±lÄ± satÄ±ÅŸ
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href={`/profil/${mockListing.seller.id}`}
                  className="w-full px-4 py-3 border-2 border-[#00833e] text-[#00833e] rounded-lg font-semibold hover:bg-green-50 transition-colors text-center"
                >
                  Profili GÃ¶r
                </Link>
              </div>
            </div>

            {/* Report Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-4">
              <button className="w-full flex items-center gap-2 text-[#8f8f8f] hover:text-red-500 transition-colors text-sm font-medium">
                <AlertCircle size={18} />
                Bu ilanÄ± bildir
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
