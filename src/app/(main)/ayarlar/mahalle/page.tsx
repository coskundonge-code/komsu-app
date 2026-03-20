"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/map/leaflet-map"), { ssr: false });
import {
  MapPin,
  Map,
  ChevronLeft,
  Filter,
  Check,
  AlertCircle,
  Ruler,
  Bell,
} from "lucide-react";

interface NearbyNeighborhood {
  id: string;
  name: string;
  distance: string;
  enabled: boolean;
}

interface PostCategory {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function MahallePage() {
  const [nearbyNeighborhoods, setNearbyNeighborhoods] =
    useState<NearbyNeighborhood[]>([
      { id: "1", name: "TeÅŸvikiye", distance: "2 km uzakta", enabled: true },
      { id: "2", name: "NiÅŸantaÅŸÄ±", distance: "3 km uzakta", enabled: false },
      { id: "3", name: "MaÃ§ka", distance: "4 km uzakta", enabled: true },
      { id: "4", name: "KurtuluÅŸ", distance: "5 km uzakta", enabled: false },
      { id: "5", name: "Cihangir", distance: "6 km uzakta", enabled: true },
    ]);

  const [postCategories, setPostCategories] = useState<PostCategory[]>([
    {
      id: "announcements",
      name: "Duyurular",
      description: "Mahalle haberleri ve Ã¶nemli duyurular",
      enabled: true,
      icon: "ğŸ“¢",
    },
    {
      id: "events",
      name: "Etkinlikler",
      description: "Mahallede yapÄ±lacak etkinlikler",
      enabled: true,
      icon: "ğŸ‰",
    },
    {
      id: "marketplace",
      name: "Pazar Yeri",
      description: "ÃœrÃ¼n satÄ±ÅŸÄ±, alÄ±mÄ± ve takas",
      enabled: true,
      icon: "ğŸ›’",
    },
    {
      id: "recommendations",
      name: "Tavsiyeler",
      description: "Mekan ve hizmet tavsiyeleri",
      enabled: true,
      icon: "â­",
    },
    {
      id: "discussions",
      name: "TartÄ±ÅŸmalar",
      description: "Genel konu tartÄ±ÅŸmalarÄ±",
      enabled: true,
      icon: "ğŸ’¬",
    },
    {
      id: "help",
      name: "YardÄ±m / Ä°htiyaÃ§lar",
      description: "YardÄ±m talepleri ve ihtiyaÃ§lar",
      enabled: false,
      icon: "ğŸ¤",
    },
  ]);

  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreference[]>([
      {
        id: "new_posts",
        label: "Yeni GÃ¶nderiler",
        description: "Mahallede yeni gÃ¶nderi yayÄ±nlandÄ±ÄŸÄ±nda bildir",
        enabled: true,
      },
      {
        id: "nearby_neighborhoods",
        label: "YakÄ±ndaki Mahalleler",
        description: "YakÄ±ndaki mahallelerde yeni gÃ¶nderiler",
        enabled: true,
      },
      {
        id: "trending",
        label: "PopÃ¼ler GÃ¶nderiler",
        description: "HaftanÄ±n en popÃ¼ler gÃ¶nderilerinin Ã¶zeti",
        enabled: false,
      },
    ]);

  const [distancePreference, setDistancePreference] = useState("5");
  const [saved, setSaved] = useState(false);

  const toggleNeighborhood = (id: string) => {
    setNearbyNeighborhoods(
      nearbyNeighborhoods.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const toggleCategory = (id: string) => {
    setPostCategories(
      postCategories.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  const toggleNotification = (id: string) => {
    setNotificationPrefs(
      notificationPrefs.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = nearbyNeighborhoods.filter((n) => n.enabled).length;
  const categoryCount = postCategories.filter((c) => c.enabled).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center gap-3">
          <Link
            href="/ayarlar"
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-text-primary" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Mahalle AyarlarÄ±</h1>
              <p className="text-sm text-text-muted">
                Mahalle ve ilgi alanlarÄ±nÄ± yÃ¶netin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Current Neighborhood */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Mevcut Mahalle
          </h2>

          {/* Map */}
          <div className="w-full h-48 rounded-lg overflow-hidden border border-border mb-6">
            <LeafletMap
              center={[41.0422, 29.0050]}
              zoom={15}
              className="w-full h-full"
              markers={[{ lat: 41.0422, lng: 29.0050, title: 'Mahalleniz', color: 'green' }]}
              showUserLocation={true}
            />
          </div>

          {/* Current Neighborhood Display */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-[#00833e]/5 rounded-lg border border-primary/20 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted font-medium">
                  Konumunuz
Ü‚ˆÈÛ\ÜÓ˜[YOH^[È›ÛX›Û^]^\š[X\H‚ˆ™qgÚZİqgË1,İ[˜[ˆÚÏ‚ˆÛ\ÜÓ˜[YOH^^È^]^[]]Y]LH‚ˆñ,Y±,\ˆqgÈXZ[\ÚBˆÜ‚ˆÙ]‚ˆÙ]‚ˆÙ]‚‚ˆËÊˆÚ[™ÙH™ZYÚ›ÜšÛÙ]Ûˆ
‹ßBˆ]ÛˆÛ\ÜÓ˜[YOHËY[KLÈM™Ë\š[X\H^]Ú]H›Û\Ù[ZX›Û›İ[™Y[Èİ™\˜™Ë\š[X\KZİ™\ˆ˜[œÚ][Û‹XÛÛÜœÈ›^][\ËXÙ[\ˆ\İYKXÙ[\ˆØ\Lˆ‚ˆX\[ˆÛ\ÜÓ˜[YOHËMHMHˆÏ‚ˆXZ[Hq'Úqgİ\‚ˆØ]Û‚ˆÙ]‚‚ˆËÊˆ\İ[˜ÙH™Y™\™[˜ÙH
‹ßBˆ]ˆÛ\ÜÓ˜[YOH˜™Ë\İ\™˜XÙH›İ[™Y[È›Ü™\ˆ›Ü™\‹X›Ü™\ˆMˆX‹Mˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\LÈX‹M‚ˆ]ˆÛ\ÜÓ˜[YOHœLˆ™ËX˜XÚÙÜ›İ[™›İ[™Y[È‚ˆ[\ˆÛ\ÜÓ˜[YOHËMHMH^\š[X\HˆÏ‚ˆÙ]‚ˆˆÛ\ÜÓ˜[YOH^[È›Û\Ù[ZX›Û^]^\š[X\H‚ˆXZñ,[™ZÚHXZ[[\ˆY\ØY™\ÚBˆÚ‚ˆÙ]‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]YX‹M‚ˆğí›™\š[\š[šHğíœ›YZÈ\İYq'Ú[š^ˆXZ[[\ˆ™HØY\ˆ^˜ZÈÛXš[\ÂˆÜ‚ˆ]ˆÛ\ÜÓ˜[YOHœÜXÙK^KLÈ‚ˆ]‚ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆ\İYKX™]ÙY[ˆX‹Lˆ‚ˆX™[Û\ÜÓ˜[YOH^\ÛH›Û[YY][H^]^\š[X\H‚ˆY\ØY™NˆÙ\İ[˜ÙT™Y™\™[˜Ù_HÛBˆÛX™[‚ˆÙ]‚ˆ[œ]ˆ\OHœ˜[™ÙH‚ˆZ[HŒH‚ˆX^HŒMH‚ˆ˜[YO^Ù\İ[˜ÙT™Y™\™[˜Ù_BˆÛÚ[™ÙO^ÊJHOˆÙ]\İ[˜ÙT™Y™\™[˜ÙJK\™Ù]˜[YJ_BˆÛ\ÜÓ˜[YOHËY[Lˆ™ËVÈÙLLLH›İ[™Y[È\X\˜[˜ÙK[›Û™Hİ\œÛÜ‹\Ú[\ˆXØÙ[VÈÌÌÙWH‚ˆÏ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^\İYKX™]ÙY[ˆ^^È^]^[]]Y]Lˆ‚ˆÜ[ŒHÛOÜÜ[‚ˆÜ[ŒMHÛOÜÜ[‚ˆÙ]‚ˆÙ]‚ˆÙ]‚ˆÙ]‚‚ˆËÊˆ™X\˜H™ZYÚ›ÜšÛÙÈ
‹ßBˆ]ˆÛ\ÜÓ˜[YOH˜™Ë\İ\™˜XÙH›İ[™Y[È›Ü™\ˆ›Ü™\‹X›Ü™\ˆMˆX‹Mˆ‚ˆ]ˆÛ\ÜÓ˜[YOH›X‹Mˆ‚ˆˆÛ\ÜÓ˜[YOH^[È›Û\Ù[ZX›Û^]^\š[X\HX‹Lˆ‚ˆXZñ,[™ZÚHXZ[[\‚ˆÚ‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]Y‚ˆÙ[˜X›YÛİ[HXZ[HZÚ\Y[^[Ü‚ˆÜ‚ˆÙ]‚‚ˆ]ˆÛ\ÜÓ˜[YOHœÜXÙK^KLÈ‚ˆÛ™X\˜S™ZYÚ›ÜšÛÙË›X\

™ZYÚ›ÜšÛÙ
HOˆ
ˆ]‚ˆÙ^O^Û™ZYÚ›ÜšÛÙšYBˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆ\İYKX™]ÙY[ˆM›İ[™Y[È™ËX˜XÚÙÜ›İ[™İ™\˜™ËVÈÙNXYYH˜[œÚ][Û‹XÛÛÜœÈ‚ˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^LH‚ˆÈÛ\ÜÓ˜[YOH™›Û\Ù[ZX›Û^]^\š[X\H‚ˆÛ™ZYÚ›ÜšÛÙ›˜[Y_BˆÚÏ‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]Y‚ˆÛ™ZYÚ›ÜšÛÙ™\İ[˜Ù_BˆÜ‚ˆÙ]‚ˆ]Û‚ˆÛÛXÚÏ^Ê
HOˆÙÙÛS™ZYÚ›ÜšÛÙ
™ZYÚ›ÜšÛÙšY
_BˆÛ\ÜÓ˜[YO^Ø™[]]™H[›[™KY›^MÈËLLˆ][\ËXÙ[\ˆ›İ[™YY[˜[œÚ][Û‹XÛÛÜœÈ›^\Úš[šËL	Âˆ™ZYÚ›ÜšÛÙ™[˜X›YÈ˜™Ë\š[X\Hˆˆ˜™ËVÈÙLLLH‚ˆXBˆ‚ˆÜ[‚ˆÛ\ÜÓ˜[YO^Ø[›[™KX›ØÚÈMHËMH˜[œÙ›Ü›H›İ[™YY[™Ë\İ\™˜XÙH˜[œÚ][Û‹]˜[œÙ›Ü›H	Âˆ™ZYÚ›ÜšÛÙ™[˜X›YÈ˜[œÛ]K^Mˆˆˆ˜[œÛ]K^LH‚ˆXBˆÏ‚ˆØ]Û‚ˆÙ]‚ˆ
J_BˆÙ]‚ˆÙ]‚‚ˆËÊˆ™ZYÚ›ÜšÛÙ™YY™Y™\™[˜Ù\È
‹ßBˆ]ˆÛ\ÜÓ˜[YOH˜™Ë\İ\™˜XÙH›İ[™Y[È›Ü™\ˆ›Ü™\‹X›Ü™\ˆMˆX‹Mˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\LÈX‹Mˆ‚ˆš[\ˆÛ\ÜÓ˜[YOHËMˆMˆ^\š[X\HˆÏ‚ˆ]‚ˆˆÛ\ÜÓ˜[YOH^[È›Û\Ù[ZX›Û^]^\š[X\H‚ˆXZ[H\˜ÚZ\šBˆÚ‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]Y‚ˆØØ]YÛÜPÛİ[HØ]YÛÜšHZİY‚ˆÜ‚ˆÙ]‚ˆÙ]‚‚ˆ]ˆÛ\ÜÓ˜[YOHœÜXÙK^KLÈ‚ˆÜÜİØ]YÛÜšY\Ë›X\

Ø]YÛÜJHOˆ
ˆX™[ˆÙ^O^ØØ]YÛÜKšYBˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\LÈM›İ[™Y[Èİ™\˜™ËX˜XÚÙÜ›İ[™İ\œÛÜ‹\Ú[\ˆ˜[œÚ][Û‹XÛÛÜœÈ›Ü™\ˆ›Ü™\‹]˜[œÜ\™[İ™\˜›Ü™\‹X›Ü™\ˆ‚ˆ‚ˆ[œ]ˆ\OH˜ÚXÚØ›Ş‚ˆÚXÚÙY^ØØ]YÛÜK™[˜X›YBˆÛÚ[™ÙO^Ê
HOˆÙÙÛPØ]YÛÜJØ]YÛÜKšY
_BˆÛ\ÜÓ˜[YOHËMMXØÙ[VÈÌÌÙWHİ\œÛÜ‹\Ú[\ˆ‚ˆÏ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^LH‚ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\Lˆ‚ˆÜ[ˆÛ\ÜÓ˜[YOH^[ÈØØ]YÛÜKšXÛÛŸOÜÜ[‚ˆÜ[ˆÛ\ÜÓ˜[YOH^]^\ÙXÛÛ™\H›Û[YY][H‚ˆØØ]YÛÜK›˜[Y_BˆÜÜ[‚ˆÙ]‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]Y]LH‚ˆØØ]YÛÜK™\ØÜš\[ÛŸBˆÜ‚ˆÙ]‚ˆÛX™[‚ˆ
J_BˆÙ]‚ˆÙ]‚‚ˆËÊˆ™YY›İYšXØ][ÛœÈ
‹ßBˆ]ˆÛ\ÜÓ˜[YOH˜™Ë\İ\™˜XÙH›İ[™Y[È›Ü™\ˆ›Ü™\‹X›Ü™\ˆMˆX‹Mˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆØ\LÈX‹Mˆ‚ˆ]ˆÛ\ÜÓ˜[YOHœLˆ™ËX˜XÚÙÜ›İ[™›İ[™Y[È‚ˆ™[Û\ÜÓ˜[YOHËMHMH^\š[X\HˆÏ‚ˆÙ]‚ˆˆÛ\ÜÓ˜[YOH^[È›Û\Ù[ZX›Û^]^\š[X\H‚ˆXZ[H™YYš[\š[[\šBˆÚ‚ˆÙ]‚‚ˆ]ˆÛ\ÜÓ˜[YOHœÜXÙK^KM‚ˆÛ›İYšXØ][Û”™YœË›X\

™YŠHOˆ
ˆ]‚ˆÙ^O^Ü™Y‹šYBˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆ\İYKX™]ÙY[ˆLÈ›İ[™Y[È™ËX˜XÚÙÜ›İ[™‚ˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^LH‚ˆÛ\ÜÓ˜[YOH™›Û[YY][H^]^\š[X\HÜ™Y‹›X™[OÜ‚ˆÛ\ÜÓ˜[YOH^\ÛH^]^[]]YÜ™Y‹™\ØÜš\[ÛŸOÜ‚ˆÙ]‚ˆ]Û‚ˆÛÛXÚÏ^Ê
HOˆÙÙÛS›İYšXØ][ÛŠ™Y‹šY
_BˆÛ\ÜÓ˜[YO^Ø™[]]™H[›[™KY›^MÈËLLˆ][\ËXÙ[\ˆ›İ[™YY[˜[œÚ][Û‹XÛÛÜœÈ›^\Úš[šËL	Âˆ™Y‹™[˜X›YÈ˜™Ë\š[X\Hˆˆ˜™ËVÈÙLLLH‚ˆXBˆ‚ˆÜ[‚ˆÛ\ÜÓ˜[YO^Ø[›[™KX›ØÚÈMHËMH˜[œÙ›Ü›H›İ[™YY[™Ë\İ\™˜XÙH˜[œÚ][Û‹]˜[œÙ›Ü›H	Âˆ™Y‹™[˜X›YÈ˜[œÛ]K^Mˆˆˆ˜[œÛ]K^LH‚ˆXBˆÏ‚ˆØ]Û‚ˆÙ]‚ˆ
J_BˆÙ]‚ˆÙ]‚‚ˆËÊˆ[™›È›Ş
‹ßBˆ]ˆÛ\ÜÓ˜[YOH˜™ËX›YKML›Ü™\ˆ›Ü™\‹X›YKLŒ›İ[™Y[ÈMX‹LLˆ‚ˆ]ˆÛ\ÜÓ˜[YOH™›^Ø\LÈ‚ˆ[\Ú\˜ÛHÛ\ÜÓ˜[YOHËMHMH^X›YKMŒ›^\Úš[šËL]LHˆÏ‚ˆ]‚ˆÛ\ÜÓ˜[YOH^\ÛH^X›YKNL‚ˆÜ[ˆÛ\ÜÓ˜[YOH™›Û\Ù[ZX›Û±,XİNÜÜ[ˆXZ[H^X\›\±,[±,^‚ˆ[Y[ˆ^Yİ[[±,\‹ˆq'ÚqgÚZÛZÛ\šHğíœ›YZÈpéÚ[ˆ™YY	Ú[š^šHY[š[^Z[‹‚ˆÜ‚ˆÙ]‚ˆÙ]‚ˆÙ]‚‚ˆËÊˆØ]™H]Ûˆ
‹ßBˆ]ˆÛ\ÜÓ˜[YOH™›^Ø\LÈX‹LLˆ‚ˆ]Û‚ˆÛÛXÚÏ^Ú[™TØ]™_BˆÛ\ÜÓ˜[YO^Ø›^LHKLÈM›İ[™Y[È›Û\Ù[ZX›Û˜[œÚ][Û‹X[	ÂˆØ]™YˆÈ˜™Ë\š[X\H^]Ú]H‚ˆˆ˜™Ë\š[X\H^]Ú]Hİ™\˜™Ë\š[X\KZİ™\ˆ‚ˆXBˆ‚ˆÜØ]™YÈ
ˆÜ[ˆÛ\ÜÓ˜[YOH™›^][\ËXÙ[\ˆ\İYKXÙ[\ˆØ\Lˆ‚ˆÚXÚÈÛ\ÜÓ˜[YOHËMHMHˆÏˆØ^YY[BˆÜÜ[‚ˆ
Hˆ
ˆ’Ø^Y]‚ˆ
_BˆØ]Û‚ˆ[šÂˆ™YH‹Ø^X\›\ˆ‚ˆÛ\ÜÓ˜[YOHœKLÈM›İ[™Y[È›Û\Ù[ZX›Û™Ë\İ\™˜XÙH›Ü™\ˆ›Ü™\‹X›Ü™\ˆ^]^\š[X\Hİ™\˜™ËX˜XÚÙÜ›İ[™˜[œÚ][Û‹XÛÛÜœÈ‚ˆ‚ˆ1,[ˆÓ[šÏ‚ˆÙ]‚ˆÙ]‚ˆÙ]‚ˆ
NÂŸB