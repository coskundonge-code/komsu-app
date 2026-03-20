'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Search,
  AlertCircle,
  AlertTriangle,
  Cloud,
  Zap,
  AlertOctagon,
  MapPin,
  Clock,
  X,
  Plus,
  CloudRain,
  Car,
  Shield,
  Construction,
  Flame,
  Volume2,
  PawPrint,
  Map,
  Eye,
  EyeOff,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { getAlerts } from 'A/lib/hooks/use-notifications';
import { useCurrentUser } from '@/lib/hooks/use-auth';

const LeafletMap = dynamic(() => import('A/components/map/leaflet-map'), { ssr: false });

interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'weather' | 'traffic' | 'security' | 'infrastructure' | 'disaster' | 'other';
  source: string;
  Active: boolean;
  icon: React.ReactNode;
}

const getCategoryIcon = (category: string) => {
  const iconClass = "w-5 h-5";
  switch (category) {
    case 'weather':
      return <CloudRain className={iconClass} />;
    case 'traffic':
      return <Car className={iconClass} />;
    case 'security':
      return <Shield className={iconClass} />;
    case 'infrastructure':
      return <Construction className={iconClass} />;
    case 'disaster':
      return <Flame className={iconClass} />;
    default:
      return <AlertCircle className={iconClass} />;
  }
};

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'FÄ±rtÄ±na UyarÄ±sÄ± - Kritik',
    description: 'GÃ¼ØÙÛ0¹Œµ¹Ë0ì[&°ìÃBƒBˆ8 jÉÕÃÃBˆÛİ\˜ÙNˆ	ÓY][Ü›ÛÚšHZ\™\Úq ĞŠÀĞ¢7F—fS¢G'VRÀĞ¢–6öã¢Ä6Æ÷VE&–â6—¦S×³#ÒóâÀĞ¢ÒÀĞ¢°Ğ¢–C¢s"rÀĞ¢F—FÆS¢u–æ|KÆâW–,K<KÒÖW&¶W¢
›JBˆ\ØÜš\[Ûˆ	ÓY\šÙ^ˆ°í›ÙYZÚHš\ˆš[˜YHğï0éğïÈX[™ñ,[ˆ0éñ,ZÛX\ñ,H\[]Kˆ1,˜Z^YHZÚXšHğí›™\š[Zqgİ\‹‰ËBˆØØ][Ûˆ	ÓY\šÙ^Hš[˜[\±,KËˆØYIËBˆ[YNˆ	ÌLˆZÚZØH0í›˜ÙIËBˆÙ]™\š]Nˆ	ØÜš]XØ[	ËBˆØ]YÛÜNˆ	Ù\Ø\İ\‰ËBˆÛİ\˜ÙNˆ	ñ,˜Z^YIËBˆXİ]™NˆYKBˆXÛÛˆ›[YHÚ^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	ÌÉËBˆ]Nˆ	ñg°ï[H\˜péÈš[\š[ZIËBˆ\ØÜš\[Ûˆ	ÔZØ\ñ,H™[\œÚ^ˆÜšH™[šÈš\ˆ\˜péÈXZ[Y[ˆÙpéÛYZİKˆ0ï™[ˆZÚØ]HÛ[^‹‰ËBˆØØ][Ûˆ	Ğ[˜HØYK\šÈXZñ,[›\±,IËBˆ[YNˆ	ÌZÚZØH0í›˜ÙIËBˆÙ]™\š]Nˆ	ÚYÚ	ËBˆØ]YÛÜNˆ	ÜÙXİ\š]IËBˆÛİ\˜ÙNˆ	ÓXZ[HØZÚ[›\šIËBˆXİ]™NˆYKBˆXÛÛˆÚY[Ú^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	Í	ËBˆ]Nˆ	ÔİHÙ\Ú[\ÚHš[\š[ZIËBˆ\ØÜš\[Ûˆ	Ğ›ÜHñ,\±,[X\ñ,H™Y[š^[HX\±,[ˆŒLMŒØX]\šH\˜\ñ,[™HİHÙ\Ú[\ÚHX\1,[XØZİ1,\‹‰ËBˆØØ][Ûˆ	ÌK™H‹ˆÛÚØZÉËBˆ[YNˆ	ÍHZÚZØH0í›˜ÙIËBˆÙ]™\š]Nˆ	ÛYY][IËBˆØ]YÛÜNˆ	Ú[™œ˜\İXİ\™IËBœÛİ\˜ÙNˆ	ÔİH1,\™\ÚIËBˆXİ]™NˆYKBˆXÛÛˆ˜\Ú^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	ÍIËBˆ]Nˆ	Ñ[ZİšZÈÙ\Ú[\ÚIËBˆ\ØÜš\[Ûˆ	Ğ˜Zñ,[H0áØ[1,qgÛX[\±,H™Y[š^[H[ZİšZÈÙ\Ú[\ÚHÙ\°êXÙZÛq'ØÙZÈˆØX]\ˆ™[\›[›YZİY\‹‰ËBˆØØ][Ûˆ	ÓY\šÙ^HXZ[IËBˆ[YNˆ	ÌHØX]0í›˜ÙIËBˆÙ]™\š]Nˆ	ÛYY][IËBˆØ]YÛÜNˆ	Ú[™œ˜\İXİ\™IËBˆÛİ\˜ÙNˆ	Ñ[ZİšZÈ1gš\šÙ]IËBˆXİ]™NˆYKBˆXÛÛˆ˜\Ú^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	Í‰ËBˆ]Nˆ	Ö[Û0áØ[1,qgÛX\ñ,HH[˜HØYIËBˆ\ØÜš\[Ûˆ	ĞHYHX\1,[XØZÈ[ÛÛ˜\±,[[\±,H™Y[š^[H˜YšZÈ0ï™[›[Y\ÚH^Yİ[[˜XØZÕ1,\‹‰ËBˆØØ][Ûˆ	Ğ[˜HØYIËBˆ[YNˆ	ÌˆØX]0í›˜ÙIËBˆÙ]™\š]Nˆ	ÛİÉËBˆØ]YÛÜNˆ	İ˜Y™šXÉËBˆÛİ\˜ÙNˆ	Ğ™[Y^YIËBˆXİ]™NˆYKBˆXÛÛˆÛÛœİXİ[ÛˆÚ^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	ÍÉËBˆ]Nˆ	ÒØ^q,\]˜Ú[^]˜[ˆHğíœZÉËBˆ\ØÜš\[Ûˆ	ÒØZ™\™[™ÚHXœ˜YÜˆğíœZÈØ^q,\ˆ1,ZH“X^‹XZÛqgá,HÈpëq,[™Kˆš[ÚHpéÚ[ˆ[]qgÚ[YHÙpéÚ[š^‹‰ËBˆØØ][Ûˆ	ÍKˆÛÚØZÉËBˆ[YNˆ	ÌÈØX]0í›˜ÙIËBˆÙ]™\š]Nˆ	ÛİÉËBˆØ]YÛÜNˆ	Ûİ\‰ËBˆÛİ\˜ÙNˆ	ÓXZ[HØZÚ[›\šIËBˆXİ]™NˆYKBˆXÛÛˆ]Ôš[Ú^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	Î	ËBˆ]Nˆ	Ñğï°ï0ï1gšZØ^Y]HHÙXÙHØX]\±,IËBˆ\ØÜš\[Ûˆ	ÑÙpéÈØX]\™HpïšZÈ™Hğï°ï0ï1gÚZØ^Y]H[1,[›q,qgİ1,\‹ˆ0ï™[ˆZÚØ]HÛ[^‹‰ËBˆØØ][Ûˆ	ÓY\šÙ^H\\X[›\±,IËBˆ[YNˆ	ÍØX]0í›˜ÙIËBˆÙ]™\š]Nˆ	ÛİÉËBˆØ]YÛÜNˆ	Ûİ\‰ËBˆÛİ\˜ÙNˆ	ÓXZ[HØZÚ[›\šIËBˆXİ]™Nˆ˜[ÙKBˆXÛÛˆ›Û[YLˆÚ^™O^ÌŒHÏ‹BˆKBˆÃBˆYˆ	ÎIËBˆ]Nˆ	Õ˜YšZÈØ^˜\ñ,HH0áØ\œ1,qgÛXIËBˆ\ØÜš\[Ûˆ	ñ,ÚH\˜péÈ\˜\ñ,[™HYšYˆ0éØ\œ1,qgÛXHY^Y[˜HÙ[Zqgİ\‹ˆX\˜[1,Hš[\š[Y[Zqgİ\‹‰ËBˆØØ][Ûˆ	Ñ0í›°ï1gÈ›Úİ\ÌYš[\Ø]YÛÜšY\ÈHŞÈYˆ	Ø[	ËX™[ˆ	Õ180ïˆ[\\‰ËXÛÛˆ	ÏÔİ\	ÈKÈYˆ	ÜÙXİ\š]IËX™[ˆ	Ñğï™[›ZÉËXÛÛˆ	ÔÚY[	ÈKÈYˆ	İÙX]\‰ËX™[ˆ	Ò]˜H\[]IËXÛÛˆ	ĞÛİY	ÈKÈYˆ	İ˜Y™šXÉÌX™[ˆ	Õ˜YšZÉËXÛÛˆ	Ğ]˜Z\™]	ÈKÈYˆ	Ú[™œ˜\İXİ\™IËX™[ˆ	Ğ[q,IËXÛÛˆ	ĞÛÛœİXİ[Û‰ÈKÈYˆ	Ù\Ø\İ\‰ËX™[ˆ	Ññ'Ø[Y™]	ËXÛÛˆ	Ñš\™P[\›IÈKÈYˆ	Ûİ\‰ËX™[ˆ	ÑqgÉËXÛÛˆ	Ñ[\Ú\ÉÈKCB¿