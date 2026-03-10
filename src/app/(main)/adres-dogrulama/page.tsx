'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload, CheckCircle2, ExternalLink, AlertCircle,
  Loader2, Shield, FileText, ScanBarcode, ArrowRight,
  RefreshCw, XCircle, Eye, Search
} from 'lucide-react';
import Link from 'next/link';

type Step = 'info' | 'scanning' | 'verifying' | 'verified' | 'failed' | 'manual';

interface DocumentInfo {
  neighborhood?: string
  district?: string
  city?: string
  address?: string
  holderName?: string
}

export default function AddressVerificationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedCode, setExtractedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [statusText, setStatusText] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
   * Ana akış: Dosya yükle → Barkod oku → Otomatik doğrula
   * Hedef: 5-10 saniye içinde tamamlansın
   */
  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    setCurrentStep('scanning');
    setErrorMessage('');
    setStatusText('Belge okunuyor...');

    try {
      // 1. Barkod kodunu çıkar
      const { extractVerificationCode } = await import('@/lib/barcode-reader');
      setStatusText('Barkod numarası aranıyor...');

      const result = await extractVerificationCode(file);

      if (!result) {
        setStatusText('Barkod otomatik okunamadı.');
        await delay(300);
        setCurrentStep('manual');
        return;
      }

      const code = result.code;
      setExtractedCode(code);

      // 2. PDF'den ek bilgileri çıkar (adres, ilçe, il)
      if (file.type === 'application/pdf') {
        const info = await extractDocumentDetails(file);
        setDocumentInfo(info);
      }

      // 3. Otomatik doğrulamaya geç
      setCurrentStep('verifying');
      setStatusText('turkiye.gov.tr belge doğrulama sorgulanıyor...');

      await verifyCode(code);

    } catch (error) {
      console.error('Process error:', error);
      setCurrentStep('manual');
    }
  }, []);

  /**
   * turkiye.gov.tr/belge-dogrulama üzerinden doğrula
   */
  const verifyCode = async (code: string) => {
    setCurrentStep('verifying');
    setStatusText('turkiye.gov.tr/belge-dogrulama sorgulanıyor...');
    setErrorMessage('');

    try {
      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, documentInfo })
      });

      const result = await response.json();

      if (result.verified) {
        setVerificationResult(result);
        setCurrentStep('verified');
      } else {
        setErrorMessage(result.message || 'Belge doğrulanamadı.');
        setCurrentStep('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage('Doğrulama sırasında bir hata oluştu.');
      setCurrentStep('failed');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = (manualCode || extractedCode).trim();
    if (code.length >= 8) {
      setExtractedCode(code);
      verifyCode(code);
    }
  };

  const resetProcess = () => {
    setCurrentStep('info');
    setUploadedFile(null);
    setExtractedCode('');
    setManualCode('');
    setStatusText('');
    setVerificationResult(null);
    setErrorMessage('');
    setDocumentInfo({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Progress step hesaplama
  const stepNum = { info: 1, scanning: 2, verifying: 3, verified: 4, failed: 3, manual: 2 }[currentStep];

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#00833e] hover:text-[#006b32] font-medium mb-4 inline-flex items-center gap-2">
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#333] mb-2">Adres Doğrulaması</h1>
          <p className="text-[#666]">e-Devlet adres belgenizi yükleyin, barkod otomatik okunup doğrulansın.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 mb-6">
          <div className="flex items-center justify-between">
            {[
              { n: 1, label: 'Belge Al', icon: FileText },
              { n: 2, label: 'Yükle & Tara', icon: ScanBarcode },
              { n: 3, label: 'Doğrula', icon: Shield },
              { n: 4, label: 'Tamamlandı', icon: CheckCircle2 }
            ].map((s, i) => {
              const Icon = s.icon;
              const done = stepNum > s.n;
              const active = stepNum === s.n;
              return (
                <div key={s.n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      done ? 'bg-[#00833e] text-white' :
                      active ? 'bg-[#00833e]/10 text-[#00833e] ring-2 ring-[#00833e]' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-medium ${done || active ? 'text-[#00833e]' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                  {i < 3 && <div className={`h-0.5 w-full mx-1 mb-5 ${done ? 'bg-[#00833e]' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== STEP: INFO ========== */}
        {currentStep === 'info' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Nasıl Çalışır?</p>
                  <p className="text-sm text-blue-800">
                    e-Devlet&apos;ten aldığınız adres belgesini yükleyin. Sistem belgedeki <strong>barkod numarasını otomatik okuyacak</strong> ve
                    turkiye.gov.tr/belge-dogrulama üzerinden <strong>anında doğrulayacak</strong>.
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
                    PDF belgeyi yükleyin — barkod kodu otomatik okunup, doğrulama anında yapılacak.
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

            {/* Manuel giriş */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
              <button
                onClick={() => setCurrentStep('manual')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-[#333]">Barkod numarasını kendiniz girmek ister misiniz?</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8f8f8f]" />
              </button>
            </div>
          </div>
        )}

        {/* ========== STEP: SCANNING (Barkod okunuyor) ========== */}
        {currentStep === 'scanning' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <ScanBarcode className="w-10 h-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Belge Taranıyor...</h2>
              <p className="text-[#666] mb-4">{statusText}</p>

              {uploadedFile && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 inline-flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#666]" />
                  <span className="text-sm text-[#666]">{uploadedFile.name}</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-[#8f8f8f]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Barkod kodu aranıyor...
              </div>
            </div>
          </div>
        )}

        {/* ========== STEP: VERIFYING (turkiye.gov.tr sorgulanıyor) ========== */}
        {currentStep === 'verifying' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Shield className="w-10 h-10 text-amber-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Belge Doğrulanıyor</h2>

              {/* Bulunan kod */}
              <div className="bg-[#f0f2f5] rounded-lg px-4 py-2 mb-6 inline-block">
                <span className="text-xs text-[#8f8f8f]">Barkod No: </span>
                <span className="font-mono font-bold text-[#333]">{extractedCode}</span>
              </div>

              {/* İşlem adımları */}
              <div className="max-w-sm mx-auto space-y-3 text-left mb-4">
                <StepItem label="Barkod kodu belgeden okundu" done />
                <StepItem label={`turkiye.gov.tr/belge-dogrulama açılıyor`} done />
                <StepItem label={`Barkod no giriliyor: ${extractedCode}`} active />
                <StepItem label="Sonuç bekleniyor..." />
              </div>

              <p className="text-sm text-[#8f8f8f]">{statusText}</p>
            </div>
          </div>
        )}

        {/* ========== STEP: VERIFIED (Başarılı) ========== */}
        {currentStep === 'verified' && verificationResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-[#e6f4ec] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-[#00833e]" />
                </div>
                <h2 className="text-2xl font-bold text-[#333] mb-2">Adresiniz Doğrulandı!</h2>
                <p className="text-[#666]">e-Devlet belgeniz turkiye.gov.tr üzerinden başarıyla doğrulandı.</p>
              </div>

              {/* Doğrulama kodu */}
              <div className="bg-[#e6f4ec] border border-[#00833e]/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00833e] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#00833e] text-sm">e-Devlet ile Doğrulanmış Komşu</p>
                    <p className="text-xs text-[#666] font-mono">Belge doğrulama kodu: {extractedCode}</p>
                  </div>
                </div>
              </div>

              {/* Belge detayları */}
              {verificationResult.details && (
                <div className="bg-[#f0f2f5] rounded-xl p-5 mb-6">
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
              <div className="text-center mb-6">
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

        {/* ========== STEP: FAILED ========== */}
        {currentStep === 'failed' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Doğrulama Başarısız</h2>
              <p className="text-[#666] mb-2">{errorMessage}</p>
              {extractedCode && (
                <p className="text-sm text-[#8f8f8f] mb-6 font-mono">Kullanılan kod: {extractedCode}</p>
              )}

              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => { setManualCode(extractedCode); setCurrentStep('manual'); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Kodu Düzenle
                </button>
                <button
                  onClick={resetProcess}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e0e0e0] text-[#666] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Baştan Başla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== STEP: MANUAL ========== */}
        {currentStep === 'manual' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-[#333] mb-2">Barkod Numarasını Girin</h2>
                <p className="text-[#666] text-sm">
                  Belgenizin sağ üst köşesindeki barkod numarasını girin.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label htmlFor="vcode" className="block text-sm font-semibold text-[#333] mb-2">
                    Barkod / Doğrulama Kodu
                  </label>
                  <input
                    id="vcode"
                    type="text"
                    value={manualCode || extractedCode}
                    onChange={(e) => { setManualCode(e.target.value.toUpperCase()); setExtractedCode(''); }}
                    placeholder="NV02-ILLE-G5U8-RLN9"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-xl text-lg font-mono tracking-wider text-center focus:outline-none focus:border-[#00833e] bg-[#f9f9f9] focus:bg-white transition-colors"
                    autoComplete="off"
                    autoFocus
                  />
                  <p className="text-xs text-[#8f8f8f] mt-2">
                    Format: XXXX-XXXX-XXXX-XXXX (belgenin sağ üst köşesinde yer alır)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={(manualCode || extractedCode).trim().length < 8}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00833e] text-white font-semibold rounded-xl hover:bg-[#006b32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-5 h-5" />
                  turkiye.gov.tr&apos;de Doğrula
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={resetProcess} className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333]">
                  <RefreshCw className="w-4 h-4" />
                  Belge yükleyerek tekrar dene
                </button>
              </div>
            </div>

            {/* Yardım */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>İpucu:</strong> Barkod numarası belgenizin sağ üst köşesinde, barkodun hemen altında yer alır.
                Örnek format: <span className="font-mono font-bold">NV02-ILLE-G5U8-RLN9</span>
              </p>
            </div>
          </div>
        )}

        {/* Referans alternatifi */}
        {(currentStep === 'info' || currentStep === 'manual' || currentStep === 'failed') && (
          <div className="mt-6 bg-white rounded-xl border border-[#e0e0e0] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#666]">Alternatif: Komşunuzdan aldığınız referans kodu ile doğrulama</span>
              </div>
              <Link href="/referans-kullan" className="text-sm font-medium text-[#00833e] hover:text-[#006b32] flex items-center gap-1">
                Referans Kullan <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** İşlem adım göstergesi */
function StepItem({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-[#00833e] flex-shrink-0" />
      ) : active ? (
        <Loader2 className="w-5 h-5 text-amber-500 animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
      )}
      <span className={`text-sm ${done ? 'text-[#333]' : active ? 'text-amber-700 font-medium' : 'text-[#8f8f8f]'}`}>
        {label}
      </span>
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

/**
 * PDF'den ek belge bilgilerini çıkar (mahalle, ilçe, il)
 */
async function extractDocumentDetails(file: File): Promise<DocumentInfo> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');

    const info: DocumentInfo = {};

    // İl ve ilçe bilgisini çıkar: "BAHÇELİEVLER / İSTANBUL" formatı
    const locationMatch = text.match(/([A-ZÇĞİÖŞÜ]+)\s*\/\s*([A-ZÇĞİÖŞÜ]+)/);
    if (locationMatch) {
      info.district = locationMatch[1];
      info.city = locationMatch[2];
    }

    // Mahalle bilgisi
    const mahMatch = text.match(/([A-ZÇĞİÖŞÜ]+(?:\s+[A-ZÇĞİÖŞÜ]+)*)\s+MAH\./);
    if (mahMatch) {
      info.neighborhood = mahMatch[1] + ' MAH.';
    }

    return info;
  } catch {
    return {};
  }
}
