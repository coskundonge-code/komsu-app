"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("A/components/map/leaflet-map"), { ssr: false });
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
      { id: "1", name: "Teşvikiye", distance: "2 km uzakta", enabled: true },
      { id: "2", name: "Nişantaşı", distance: "3 km uzakta", enabled: false },
      { id: "3", name: "Maçka", distance: "4 km uzakta", enabled: true },
      { id: "4", name: "Kurtuluş", distance: "5 km uzakta", enabled: false },
      { id: "5", name: "Cihangir", distance: "6 km uzakta", enabled: true },
    ]);

  const [postCategories, setPostCategories] = useState<PostCategory[]>([
    {
      id: "announcements",
      name: "Duyurular",
      description: "Mahalle haberleri ve önemli duyurular",
      enabled: true,
      icon: "📢",
    },
    {
      id: "events",
      name: "Etkinlikler",
      description: "Mahallede yapılacak etkinlikler",
      enabled: true,
      icon: "🎉",
    },
    {
      id: "marketplace",
      name: "Pazar Yeri",
      description: "