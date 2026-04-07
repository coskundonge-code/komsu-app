'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { startFreeTrial, MONTHLY_PRICE, YEARLY_PRICE, FREE_TRIAL_MONTHS } from '@/lib/services/business-subscription';
import {
  ChevronLeft,
  Upload,
  Check,
  Camera,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  Gift,
  CreditCard,
  Shield,
  Loader2,
  Store,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'Restoran',
  'Kafe',
  'Market',
  'Kuaför',
  'Eczane',
  'Tesisatçı',
  'Elektrikçi',
  'Temizlik',
  'Eğitim',
  'Sağlık',
  'Diğer',
];

const DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

interface WorkingHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

interface FormData {
  logo: string | null;
  cover: string | null;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  workingHours: WorkingHours;
}

export default function IsletmeEklePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);