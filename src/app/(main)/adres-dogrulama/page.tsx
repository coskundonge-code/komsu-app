'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, CheckCircle2, ExternalLink, AlertCircle,
  Loader2, Shield, FileText, ScanBarcode, ArrowRight,
  RefreshCw, XCircle, Eye, Search, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'upload' | 'processing' | 'verified' | 'failed';

interface ProcessStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
  detail?: string;
}

interface DocumentInfo {
  neighborhood?: string;
  district?: string;
  city?: string;
  address?: string;
  holderName?: string;
}

export default function AddressVerificationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedCode, setExtractedCode] = useState('');
  const [extractedTc, setExtractedTc] = useState('');
  const [userTcKimlikNo, setUserTcKimlikNo] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // İşlem adımları
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { id: 'read', label: 'Belge okunuyor...', status: 'pending' },
    { id: 'barcode', label: 'Barkod numarası aranıyor...', status: 'pending' },
    { id: 'tc', label: 'TC Kimlik No kontrol ediliyor...', status: 'pending' },
    { id: 'edevlet', label: 'e-Devlet belge doğrulama sorgulanıyor...', status: 'pending' },
    { id: 'compare', label: 'Adres bilgileri karşılaştırılıyor...', status: 'pending' },
    { id: 'result', label: 'Sonuç belirleniyor...', status: 'pending' },
  ]);

  // Kullanıcının TC Kimlik No'sunu profil bilgisinden al
  useEffect(() => {
    const fetchUserTC = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.tc_kimlik_no) {
        setUserTcKimlikNo(user.user_metadata.tc_kimlik_no);
      }
    };
    fetchUserTC();
  }, []);

  // Adım güncelle helper
  const updateStep = (id: string, status: ProcessStep['status'], detail?: string) => {
    setProcessSteps(prev =>
      prev.map(s => s.id === id ? { ...s, status, detail: detail ?? s.detail } : s)
    );
  };

  const updateStepLabel = (id: string, label: string) => {
    setProcessSteps(prev =>
      prev.map(s => s.id === id ? { ...s, label } : s)
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  /**
   * Tam otomatik akış:
   * Dosya yükle → Barkod oku → TC al → e-Devlet sorgula → Sonuç
   */
  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    setCurrentStep('processing');
    setErrorMessage('');

    // Adımları sıfırla
    setProcessSteps([
      { id: 'read', label: 'Belge okunuyor...', status: 'pending' },
      { id: 'barcode', label: 'Barkod numarası aranıyor...', status: 'pending' },
      { id: 'tc', label: 'TC Kimlik No kontrol ediliyor...', status: 'pending' },
      { id: 'edevlet', label: 'e-Devlet belge doğrulama sorgulanıyor...', status: 'pending' },
      { id: 'compare', label: 'Adres bilgileri karşılaştırılıyor...', status: 'pending' },
      { id: 'result', label: 'Sonuç belirleniyor...', status: 'pending' },
    ]);

    try {
      // ===== ADIM 1: Belge okunuyor =====
      updateStep('read', 'active');
      await delay(500);

      const { extractFullDocumentInfo, extractVerificationCode } = await import('@/lib/barcode-reader');

      updateStep('read', 'done', file.name);
      updateStepLabel('read', `Belge okundu: ${file.name}`);

      // ===== ADIM 2: Barkod numarası aranıyor =====
      updateStep('barcode', 'active');
      await delay(300);

      let code: string | null = null;
      let tcFromDoc: string | null = null;

      // Önce tam çıkarma dene
      const fullInfo = await extractFullDocumentInfo(file);

      if (fullInfo) {
        code = fullInfo.code;
        tcFromDoc = fullInfo.tcKimlikNo;

        // Belge bilgilerini kaydet
        const info: DocumentInfo = {};
        if (fullInfo.neighborhood) info.neighborhood = fullInfo.neighborhood;
        if (fullInfo.district) info.district = fullInfo.district;
        if (fullInfo.city) info.city = fullInfo.city;
        if (fullInfo.address) info.address = fullInfo.address;
        if (fullInfo.fullName) info.holderName = fullInfo.fullName;
        setDocumentInfo(info);

        if (tcFromDoc) setExtractedTc(tcFromDoc);
      }

      // Fallback: sadece barkod çıkar
      if (!code) {
        const result = await extractVerificationCode(file);
        if (result) code = result.code;
      }

      if (!code) {
        updateStep('barcode', 'error');
        updateStepLabel('barcode', 'Barkod numarası belgede bulunamadı');
        setErrorMessage('Belgede barkod numarası bulunamadı. Lütfen e-Devlet\'ten indirdiğiniz orijinal PDF belgeyi yükleyin.');
        setCurrentStep('failed');
        return;
      }

      setExtractedCode(code);
      updateStep('barcode', 'done');
      updateStepLabel('barcode', `Barkod numarası belgeden bulundu: ${code}`);

      // ===== ADIM 3: TC Kimlik No kontrol ediliyor =====
      updateStep('tc', 'active');
      await delay(400);

      const tcToUse = userTcKimlikNo || tcFromDoc || '';

      if (!tcToUse) {
        updateStep('tc', 'error');
        updateStepLabel('tc', 'TC Kimlik No bulunamadı');
        setErrorMessage('TC Kimlik numaranız bulunamadı. Lütfen profil ayarlarınızdan TC Kimlik No\'nuzu ekleyin.');
        setCurrentStep('failed');
        return;
      }

      // TC'yi maskele: 400****0692 gibi
      const maskedTc = tcToUse.substring(0, 3) + '****' + tcToUse.substring(7);
      updateStep('tc', 'done');
      updateStepLabel('tc', `TC Kimlik No alındı: ${maskedTc}`);

      // ===== ADIM 4: e-Devlet sorgulanıyor =====
      updateStep('edevlet', 'active');
      updateStepLabel('edevlet', 'Barkod numarası e-Devlet\'e giriliyor...');
      await delay(600);

      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          tcKimlikNo: tcToUse,
          documentInfo
        })
      });

      const result = await response.json();

      updateStep('edevlet', 'done');
      updateStepLabel('edevlet', 'e-Devlet belge doğrulama sorgusu tamamlandı');

      // ===== ADIM 5: Karşılaştırma =====
      updateStep('compare', 'active');
      updateStepLabel('compare', 'Adres bilgileri karşılaştırılıyor...');
      await delay(500);

      updateStep('compare', 'done');
      updateStepLabel('compare', 'Adres bilgileri karşılaştırıldı');

      // ===== ADIM 6: Sonuç =====
      updateStep('result', 'active');
      await delay(400);

      if (result.verified) {
        setVerificationResult(result);
        updateStep('result', 'done');
        updateStepLabel('result', 'Adres doğrulandı!');
        await delay(800);
        setCurrentStep('verified');
      } else {
        updateStep('result', 'error');
        updateStepLabel('result', 'Adres doğrulanamadı');
        setErrorMessage(result.message || 'Belge e-Devlet üzerinden doğrulanamadı.');
        await delay(600);
        setCurrentStep('failed');
      }

    } catch (error) {
      console.error('Process error:', error);
      setErrorMessage('Doğrulama sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      setCurrentStep('failed');
    }
  }, [userTcKimlikNo]);

  const resetProcess = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setExtractedCode('');
    setErrorMessage('');
    setVerificationResult(null);
    setDocumentInfo({});
    setProcessSteps([
      { id: 'read', label: 'Belge okunuyor...', status: 'pending' },
      { id: 'barcode', label: 'Barkod numarası aranıyor...', status: 'pending' },
      { id: 'tc', label: 'TC Kimlik No kontrol ediliyor...', status: 'pending' },
      { id: 'edevlet', label: 'e-Devlet belge doğrulama sorgulanıyor...', status: 'pending' },
      { id: 'compare', label: 'Adres bilgileri karşılaştırılıyor...', status: 'pending' },
      { id: 'result', label: 'Sonuç belirleniyor...', status: 'pending' },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Progress bar yüzdesi
  const completedSteps = processSteps.filter(s => s.status === 'done').length;
  const progressPercent = Math.round((completedSteps / processSteps.length) * 100);

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#00833e] hover:text-[#006b32] font-medium mb-4 inline-flex items-center gap-2">
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#333] mb-2">Adres Doğrulaması</h1>
          <p className="text-[#666]">e-Devlet adres belgenizi yükleyin, doğrulama otomatik olarak yapılsın.</p>
        </div>

        {/* ========== ADIM: UPLOAD (Belge Yükle) ========== */}
        {currentStep === 'upload' && (
          <div className="space-y-6">
            {/* Nasıl çalışır */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Nasıl Çalışır?</p>
                  <p className="text-sm text-blue-800">
                    e-Devlet&apos;ten aldığınız adres belgesini yükleyin. Sistem barkod numarasını otomatik okuyacak,
                    e-Devlet&apos;e girecek ve adresinizi anında doğrulayacak.
                    Sizin hiçbir şey yapmanıza gerek yok.
                  </p>
                </div>
              </div>
            </div>

            {/* e-Devlet link */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00833e]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#00833e]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">1. e-Devlet&apos;ten Belge Alın</h2>
                  <p className="text-[#666] text-sm mb-4">
                    &quot;Yerleşim Yeri ve Diğer Adres Belgesi&quot; hizmetinden PDF belgenizi indirin.
                  </p>
                  <a
                    href="https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                  >
                    e-Devlet&apos;e Git
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">2. Belgeyi Yükleyin</h2>
                  <p className="text-[#666] text-sm mb-4">
                    PDF belgenizi yükleyin — gerisini biz hallederiz.
                  </p>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-[#00833e] bg-[#00833e]/5 scale-[1.02]'
                        : 'border-[#e0e0e0] hover:border-[#00833e]/50 hover:bg-gray-50'
                    }`}
                  >
                    <ScanBarcode className="w-10 h-10 text-[#8f8f8f] mx-auto mb-3" />
                    <p className="font-semibold text-[#333] mb-1">Belgeyi Sürükleyip Bırakın</p>
                    <p className="text-sm text-[#666] mb-2">
                      veya <span className="text-[#00833e] font-medium">tıklayarak seçin</span>
                    </p>
                    <p className="text-xs text-[#8f8f8f]">PDF, PNG, JPG — En fazla 10 MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Referans alternatifi */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#666]">Alternatif: Komşu referans kodu ile doğrulama</span>
                </div>
                <Link href="/referans-kullan" className="text-sm font-medium text-[#00833e] hover:text-[#006b32] flex items-center gap-1">
                  Referans Kullan <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========== ADIM: PROCESSING (Otomatik Süreç) ========== */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            {/* Progress bar üst kısım */}
            <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] px-6 py-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Adres Doğrulanıyor</h2>
                  <p className="text-white/80 text-sm">Lütfen bekleyin, işlem otomatik olarak yapılıyor...</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-white rounded-full h-2.5 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-white/70 text-xs mt-2 text-right">{progressPercent}%</p>
            </div>

            {/* Dosya bilgisi */}
            {uploadedFile && (
              <div className="px-6 py-3 bg-[#f9f9f9] border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedFile.name}</span>
                  <span className="text-xs text-[#8f8f8f]">({(uploadedFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              </div>
            )}

            {/* Süreç adımları */}
            <div className="px-6 py-5 space-y-4">
              {processSteps.map((step) => (
                <ProcessStepRow key={step.id} step={step} />
              ))}
            </div>
          </div>
        )}

        {/* ========== ADIM: VERIFIED (Başarılı) ========== */}
        {currentStep === 'verified' && verificationResult && (
          <div className="space-y-6">
            {/* Süreç özeti */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
              <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Adresiniz Doğrulandı!</h2>
                    <p className="text-white/80 text-sm">e-Devlet belgesi başarıyla doğrulandı.</p>
                  </div>
                </div>
              </div>

              {/* Tamamlanan adımların özeti */}
              <div className="px-6 py-4 space-y-3">
                {processSteps.map((step) => (
                  <ProcessStepRow key={step.id} step={step} />
                ))}
              </div>
            </div>

            {/* Doğrulama detayları */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              {/* Doğrulama rozeti */}
              <div className="bg-[#e6f4ec] border border-[#00833e]/30 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00833e] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#00833e] text-sm">e-Devlet ile Doğrulanmış Komşu</p>
                    <p className="text-xs text-[#666] font-mono">Barkod: {extractedCode}</p>
                  </div>
                </div>
              </div>

              {/* Belge detayları */}
              {verificationResult.details && (
                <div className="bg-[#f0f2f5] rounded-xl p-5 mb-5">
                  <h3 className="font-semibold text-[#333] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Belge Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <DetailRow label="Belge Türü" value={verificationResult.details.documentType} />
                    <DetailRow label="Düzenlenme" value={verificationResult.details.issueDate} />
                    <DetailRow label="Geçerlilik" value={verificationResult.details.validUntil} />
                    {(documentInfo.district || verificationResult.details.district) && (
                      <DetailRow label="İlçe" value={documentInfo.district || verificationResult.details.district} />
                    )}
                    {(documentInfo.city || verificationResult.details.city) && (
                      <DetailRow label="İl" value={documentInfo.city || verificationResult.details.city} />
                    )}
                  </div>
                </div>
              )}

              {/* turkiye.gov.tr link */}
              <div className="text-center mb-5">
                <a
                  href="https://www.turkiye.gov.tr/belge-dogrulama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32]"
                >
                  <Eye className="w-4 h-4" />
                  turkiye.gov.tr/belge-dogrulama
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors text-center"
                >
                  Ana Sayfaya Git
                </Link>
                <Link
                  href="/davet"
                  className="flex-1 px-6 py-3 bg-white border-2 border-[#00833e] text-[#00833e] font-semibold rounded-lg hover:bg-[#e6f4ec] transition-colors text-center"
                >
                  Komşularını Davet Et
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========== ADIM: FAILED (Başarısız) ========== */}
        {currentStep === 'failed' && (
          <div className="space-y-6">
            {/* Süreç özeti - hata ile */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Doğrulama Başarısız</h2>
                    <p className="text-white/80 text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>

              {/* Adımların durumu */}
              <div className="px-6 py-4 space-y-3">
                {processSteps.map((step) => (
                  <ProcessStepRow key={step.id} step={step} />
                ))}
              </div>
            </div>

            {/* Aksiyon butonları */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <h3 className="font-semibold text-[#333] mb-4">Ne yapabilirsiniz?</h3>
              <div className="space-y-3">
                <button
                  onClick={resetProcess}
                  className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Farklı Bir Belge Yükle
                </button>
                <a
                  href="https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-5 py-3.5 border border-[#e0e0e0] text-[#666] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  e-Devlet&apos;ten Yeni Belge Al
                </a>
              </div>
            </div>

            {/* Referans alternatifi */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666]">Alternatif: Komşu referans kodu ile doğrulama</span>
                <Link href="/referans-kullan" className="text-sm font-medium text-[#00833e] hover:text-[#006b32] flex items-center gap-1">
                  Referans Kullan <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Süreç adım satırı - animasyonlu */
function ProcessStepRow({ step }: { step: ProcessStep }) {
  return (
    <div className={`flex items-start gap-3 transition-all duration-300 ${
      step.status === 'pending' ? 'opacity-40' : 'opacity-100'
    }`}>
      <div className="flex-shrink-0 mt-0.5">
        {step.status === 'done' && (
          <div className="w-6 h-6 bg-[#00833e] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
        {step.status === 'active' && (
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
          </div>
        )}
        {step.status === 'error' && (
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
        {step.status === 'pending' && (
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-relaxed ${
          step.status === 'done' ? 'text-[#333] font-medium' :
          step.status === 'active' ? 'text-amber-700 font-medium' :
          step.status === 'error' ? 'text-red-600 font-medium' :
          'text-[#8f8f8f]'
        }`}>
          {step.label}
        </p>
      </div>
    </div>
  );
}

/** Belge detay satırı */
function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#666]">{label}:</span>
      <span className="text-[#333] font-medium">{value}</span>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
