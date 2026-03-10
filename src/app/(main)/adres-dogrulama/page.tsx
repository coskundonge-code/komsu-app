'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, CheckCircle2, ExternalLink, AlertCircle,
  Loader2, Shield, FileText, ScanBarcode, ArrowRight,
  RefreshCw, XCircle, Eye
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Step = 'upload' | 'processing' | 'manual-entry' | 'verified' | 'failed';

interface ProcessStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
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
  const [manualCode, setManualCode] = useState('');
  const [manualTc, setManualTc] = useState('');
  const [extractedTc, setExtractedTc] = useState('');
  const [userTcKimlikNo, setUserTcKimlikNo] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

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

  const updateStep = (id: string, status: ProcessStep['status'], label?: string) => {
    setProcessSteps(prev =>
      prev.map(s => s.id === id ? { ...s, status, label: label ?? s.label } : s)
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
   * Ana akış: Dosya → Barkod Okuma
   * Barkod bulunamazsa manuel giriş ekranına yönlendir
   * Barkod bulunursa doğrulamaya devam et
   */
  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    setCurrentStep('processing');
    setErrorMessage('');

    const isImage = file.type.startsWith('image/');

    setProcessSteps([
      { id: 'read', label: isImage ? 'Fotoğraf yükleniyor...' : 'PDF belgesi yükleniyor...', status: 'pending' },
      { id: 'ocr', label: isImage ? 'Fotoğraftan metin okunuyor (OCR)...' : 'PDF belgeden metin çıkarılıyor (OCR)...', status: 'pending' },
      { id: 'barcode', label: 'Barkod numarası aranıyor...', status: 'pending' },
    ]);

    try {
      // ADIM 1: Dosya yükleniyor
      updateStep('read', 'active');
      await delay(400);
      updateStep('read', 'done', `Dosya yüklendi: ${file.name}`);

      // ADIM 2: OCR ile metin çıkarma
      updateStep('ocr', 'active');

      const { extractFullDocumentInfo } = await import('@/lib/barcode-reader');
      const fullInfo = await extractFullDocumentInfo(file);

      updateStep('ocr', 'done', 'Metin başarıyla okundu');

      // Belge bilgilerini kaydet
      if (fullInfo) {
        if (fullInfo.tcKimlikNo) setExtractedTc(fullInfo.tcKimlikNo);
        const info: DocumentInfo = {};
        if (fullInfo.neighborhood) info.neighborhood = fullInfo.neighborhood;
        if (fullInfo.district) info.district = fullInfo.district;
        if (fullInfo.city) info.city = fullInfo.city;
        if (fullInfo.address) info.address = fullInfo.address;
        if (fullInfo.fullName) info.holderName = fullInfo.fullName;
        setDocumentInfo(info);
      }

      // ADIM 3: Barkod arama
      updateStep('barcode', 'active');
      await delay(200);

      const code = fullInfo?.code || null;

      if (code) {
        setExtractedCode(code);
        updateStep('barcode', 'done', `Barkod bulundu: ${code}`);

        // TC var mı kontrol et — TC yoksa bile manuel giriş ekranına yönlendir
        const tcToUse = userTcKimlikNo || fullInfo?.tcKimlikNo || '';
        if (tcToUse) {
          // Barkod + TC mevcut → doğrulamaya devam et
          await runVerification(code, tcToUse);
        } else {
          // Barkod bulundu ama TC yok → manuel giriş ekranı (sadece TC)
          setCurrentStep('manual-entry');
        }
      } else {
        updateStep('barcode', 'error', 'Barkod numarası belgede bulunamadı');
        // Manuel giriş ekranına yönlendir (barkod + TC)
        setCurrentStep('manual-entry');
      }

    } catch (error) {
      console.error('Process error:', error);
      setErrorMessage('Belge işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setCurrentStep('failed');
    }
  }, [userTcKimlikNo]);

  /**
   * e-Devlet doğrulama sorgusu
   */
  const runVerification = async (code: string, tcKimlikNo: string) => {
    // Doğrulama adımlarını ekle
    setProcessSteps(prev => [
      ...prev,
      { id: 'edevlet', label: 'e-Devlet belge doğrulama sorgulanıyor...', status: 'pending' },
      { id: 'result', label: 'Sonuç belirleniyor...', status: 'pending' },
    ]);
    setCurrentStep('processing');

    try {
      // e-Devlet sorgusu
      updateStep('edevlet', 'active');
      await delay(500);

      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, tcKimlikNo, documentInfo })
      });

      const result = await response.json();
      updateStep('edevlet', 'done', 'e-Devlet sorgusu tamamlandı');

      // Sonuç
      updateStep('result', 'active');
      await delay(300);

      if (result.verified) {
        setVerificationResult(result);
        updateStep('result', 'done', 'Adres doğrulandı!');
        await delay(600);
        setCurrentStep('verified');
      } else {
        updateStep('result', 'error', 'Adres doğrulanamadı');
        setErrorMessage(result.message || 'Belge e-Devlet üzerinden doğrulanamadı.');
        await delay(400);
        setCurrentStep('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage('Doğrulama sırasında bir hata oluştu.');
      setCurrentStep('failed');
    }
  };

  /**
   * Manuel giriş sonrası doğrulamaya devam et
   */
  const continueWithManualEntry = useCallback(async () => {
    // Barkod kodu
    let code = extractedCode; // otomatik bulunduysa zaten var
    if (!code) {
      code = manualCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length === 16) {
        code = `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
      }
    }

    if (!code || code.replace(/[^A-Z0-9]/g, '').length < 10) {
      setErrorMessage('Geçerli bir barkod numarası girin.');
      return;
    }

    // TC Kimlik No
    const tc = userTcKimlikNo || extractedTc || manualTc.trim();
    if (!tc || !/^[1-9]\d{10}$/.test(tc)) {
      setErrorMessage('Geçerli bir TC Kimlik No girin (11 haneli).');
      return;
    }

    setExtractedCode(code);
    setErrorMessage('');

    // İşlem adımlarını güncelle
    setProcessSteps([
      { id: 'barcode', label: `Barkod numarası: ${code}`, status: 'done' },
      { id: 'tc', label: `TC Kimlik No: ${tc.substring(0, 3)}****${tc.substring(7)}`, status: 'done' },
    ]);

    await runVerification(code, tc);
  }, [extractedCode, manualCode, manualTc, userTcKimlikNo, extractedTc, documentInfo]);

  const resetProcess = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setExtractedCode('');
    setManualCode('');
    setManualTc('');
    setErrorMessage('');
    setVerificationResult(null);
    setDocumentInfo({});
    setProcessSteps([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const completedSteps = processSteps.filter(s => s.status === 'done').length;
  const progressPercent = processSteps.length > 0
    ? Math.round((completedSteps / processSteps.length) * 100)
    : 0;

  // Manuel giriş ekranında: barkod zaten bulunduysa sadece TC iste
  const needsManualBarcode = !extractedCode;
  const needsManualTc = !userTcKimlikNo && !extractedTc;

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

        {/* ========== UPLOAD ========== */}
        {currentStep === 'upload' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Nasıl Çalışır?</p>
                  <p className="text-sm text-blue-800">
                    e-Devlet&apos;ten aldığınız adres belgesini (PDF veya fotoğraf) yükleyin.
                    Sistem barkod numarasını otomatik olarak okuyup doğrulama yapacak.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00833e]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#00833e]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">1. e-Devlet&apos;ten Belge Alın</h2>
                  <p className="text-[#666] text-sm mb-4">
                    &quot;Yerleşim Yeri ve Diğer Adres Belgesi&quot; hizmetinden belgenizi indirin veya ekran görüntüsü alın.
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

            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">2. Belgeyi Yükleyin</h2>
                  <p className="text-[#666] text-sm mb-4">
                    PDF belgenizi veya fotoğrafını yükleyin. Barkod numarasını otomatik okuyacağız.
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

        {/* ========== PROCESSING ========== */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            <div className="bg-gradient-to-r from-[#00833e] to-[#006b32] px-6 py-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">İşlem Devam Ediyor</h2>
                  <p className="text-white/80 text-sm">Lütfen bekleyin...</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-white rounded-full h-2.5 transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-white/70 text-xs mt-2 text-right">{progressPercent}%</p>
            </div>

            {uploadedFile && (
              <div className="px-6 py-3 bg-[#f9f9f9] border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedFile.name}</span>
                  <span className="text-xs text-[#8f8f8f]">({(uploadedFile.size / 1024).toFixed(0)} KB)</span>
                </div>
              </div>
            )}

            <div className="px-6 py-5 space-y-4">
              {processSteps.map((step) => (
                <ProcessStepRow key={step.id} step={step} />
              ))}
            </div>
          </div>
        )}

        {/* ========== MANUEL GİRİŞ ========== */}
        {currentStep === 'manual-entry' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <ScanBarcode className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {needsManualBarcode ? 'Bilgi Girişi Gerekli' : 'TC Kimlik No Gerekli'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {needsManualBarcode
                        ? 'Barkod numarası otomatik bulunamadı, lütfen kendiniz girin.'
                        : 'Barkod bulundu! Doğrulama için TC Kimlik No gerekli.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Tamamlanan adımlar */}
              {processSteps.length > 0 && (
                <div className="px-6 py-4 space-y-3 border-b border-[#e0e0e0]">
                  {processSteps.map((step) => (
                    <ProcessStepRow key={step.id} step={step} />
                  ))}
                </div>
              )}

              {/* Manuel giriş formu */}
              <div className="px-6 py-6 space-y-5">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* Barkod alanı */}
                {needsManualBarcode && (
                  <div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">Barkod Numarasını Nerede Bulabilirsiniz?</p>
                          <p className="text-sm text-amber-800">
                            e-Devlet belgenizin sağ üst köşesinde, barkod resminin hemen altında{' '}
                            <strong>XXXX-XXXX-XXXX-XXXX</strong> formatında yazılmıştır.
                          </p>
                        </div>
                      </div>
                    </div>

                    <label htmlFor="manual-barcode" className="block text-sm font-semibold text-[#333] mb-2">
                      Barkod / Doğrulama Numarası
                    </label>
                    <input
                      id="manual-barcode"
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      placeholder="Örn: NV02-ILLE-G5U8-RLN9"
                      className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 focus:border-[#00833e] focus:ring-[#00833e]/20 font-mono text-base tracking-wider"
                      autoFocus
                    />
                    <p className="text-xs text-[#8f8f8f] mt-1">
                      Tire ile veya tiresiz girebilirsiniz.
                    </p>
                  </div>
                )}

                {/* Barkod bulunduysa göster */}
                {!needsManualBarcode && extractedCode && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-900 text-sm">Barkod Belgeden Okundu</p>
                        <p className="text-green-800 font-mono text-base tracking-wider">{extractedCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TC Kimlik No alanı */}
                {needsManualTc && (
                  <div>
                    <label htmlFor="manual-tc" className="block text-sm font-semibold text-[#333] mb-2">
                      TC Kimlik Numaranız
                    </label>
                    <input
                      id="manual-tc"
                      type="text"
                      value={manualTc}
                      onChange={(e) => setManualTc(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="11 haneli TC Kimlik No"
                      className="w-full px-4 py-3 border border-[#e0e0e0] rounded-xl text-sm text-[#333] placeholder-[#8f8f8f] bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 focus:border-[#00833e] focus:ring-[#00833e]/20 font-mono text-base tracking-wider"
                      maxLength={11}
                      autoFocus={!needsManualBarcode}
                    />
                    <p className="text-xs text-[#8f8f8f] mt-1">
                      e-Devlet doğrulaması için TC Kimlik numaranız gereklidir.
                    </p>
                  </div>
                )}

                {/* TC profilde varsa göster */}
                {!needsManualTc && (userTcKimlikNo || extractedTc) && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>TC Kimlik No: {(userTcKimlikNo || extractedTc).substring(0, 3)}****{(userTcKimlikNo || extractedTc).substring(7)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={continueWithManualEntry}
                    disabled={
                      (needsManualBarcode && manualCode.replace(/[^A-Za-z0-9]/g, '').length < 10) ||
                      (needsManualTc && manualTc.length < 11)
                    }
                    className="flex-1 px-6 py-3 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Doğrulamaya Devam Et
                  </button>
                  <button
                    onClick={resetProcess}
                    className="px-6 py-3 border border-[#e0e0e0] text-[#666] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Baştan Başla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== VERIFIED ========== */}
        {currentStep === 'verified' && verificationResult && (
          <div className="space-y-6">
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

              <div className="px-6 py-4 space-y-3">
                {processSteps.map((step) => (
                  <ProcessStepRow key={step.id} step={step} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="bg-[#e6f4ec] border border-[#00833e]/30 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00833e] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#00833e] text-sm">e-Devlet ile Doğrulanmış Komşu</p>
                    <p className="text-xs text-[#666] font-mono">Barkod: {extractedCode}</p>
                  </div>
                </div>
              </div>

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

        {/* ========== FAILED ========== */}
        {currentStep === 'failed' && (
          <div className="space-y-6">
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

              {processSteps.length > 0 && (
                <div className="px-6 py-4 space-y-3">
                  {processSteps.map((step) => (
                    <ProcessStepRow key={step.id} step={step} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <h3 className="font-semibold text-[#333] mb-4">Ne yapabilirsiniz?</h3>
              <div className="space-y-3">
                <button
                  onClick={resetProcess}
                  className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tekrar Dene
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
      <p className={`text-sm leading-relaxed ${
        step.status === 'done' ? 'text-[#333] font-medium' :
        step.status === 'active' ? 'text-amber-700 font-medium' :
        step.status === 'error' ? 'text-red-600 font-medium' :
        'text-[#8f8f8f]'
      }`}>
        {step.label}
      </p>
    </div>
  );
}

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
