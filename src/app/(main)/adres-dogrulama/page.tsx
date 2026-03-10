'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload, CheckCircle2, ExternalLink, Clock, AlertCircle,
  Search, Loader2, Shield, FileText, ScanBarcode, ArrowRight,
  RefreshCw, XCircle, Eye
} from 'lucide-react';
import Link from 'next/link';

type Step = 'info' | 'upload' | 'scanning' | 'code-found' | 'verifying' | 'verified' | 'failed' | 'manual';

export default function AddressVerificationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedCode, setExtractedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process uploaded file: extract barcode automatically
  const processFile = useCallback(async (file: File) => {
    setUploadedFile(file);
    setCurrentStep('scanning');
    setScanProgress(0);
    setScanStatus('Belge yükleniyor...');
    setErrorMessage('');

    try {
      // Step 1: Loading
      setScanProgress(10);
      setScanStatus('Belge analiz ediliyor...');
      await delay(500);

      // Step 2: Extract code
      setScanProgress(30);
      setScanStatus(file.type === 'application/pdf'
        ? 'PDF belgeden metin çıkarılıyor...'
        : 'Görüntü taranıyor...');
      await delay(800);

      // Import barcode reader dynamically
      const { extractVerificationCode } = await import('@/lib/barcode-reader');

      setScanProgress(60);
      setScanStatus('Barkod ve doğrulama kodu aranıyor...');

      const result = await extractVerificationCode(file);

      if (result) {
        setScanProgress(100);
        setScanStatus('Doğrulama kodu bulundu!');
        setExtractedCode(result.code);
        await delay(500);
        setCurrentStep('code-found');
      } else {
        setScanProgress(100);
        setScanStatus('Barkod otomatik okunamadı.');
        await delay(500);
        setCurrentStep('manual');
      }
    } catch (error) {
      console.error('Barcode extraction error:', error);
      setScanProgress(100);
      setScanStatus('Otomatik tarama başarısız oldu.');
      await delay(500);
      setCurrentStep('manual');
    }
  }, []);

  // Verify code against turkiye.gov.tr
  const verifyCode = useCallback(async (code: string) => {
    setCurrentStep('verifying');
    setScanProgress(0);
    setScanStatus('turkiye.gov.tr belge doğrulama sistemine bağlanılıyor...');
    setErrorMessage('');

    try {
      setScanProgress(20);
      await delay(500);
      setScanStatus('Barkod numarası gönderiliyor...');
      setScanProgress(40);
      await delay(500);
      setScanStatus('Belge doğrulanıyor...');
      setScanProgress(60);

      const response = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const result = await response.json();

      setScanProgress(100);

      if (result.verified) {
        setScanStatus('Belge başarıyla doğrulandı!');
        setVerificationResult(result);
        await delay(500);
        setCurrentStep('verified');
      } else {
        setErrorMessage(result.message || 'Belge doğrulanamadı.');
        setCurrentStep('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage('Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setCurrentStep('failed');
    }
  }, []);

  // Handle manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim().length >= 8) {
      setExtractedCode(manualCode.trim());
      verifyCode(manualCode.trim());
    }
  };

  // Reset everything
  const resetProcess = () => {
    setCurrentStep('info');
    setUploadedFile(null);
    setExtractedCode('');
    setManualCode('');
    setScanProgress(0);
    setScanStatus('');
    setVerificationResult(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-[#00833e] hover:text-[#006b32] font-medium mb-4 inline-flex items-center gap-2">
            ← Ana Sayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#333] mb-2">Adres Doğrulaması</h1>
          <p className="text-[#666]">e-Devlet adres belgenizi yükleyin, otomatik olarak doğrulansın.</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 mb-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Belge Al', icon: FileText },
              { num: 2, label: 'Yükle', icon: Upload },
              { num: 3, label: 'Tara', icon: ScanBarcode },
              { num: 4, label: 'Doğrula', icon: Shield }
            ].map((step, i) => {
              const Icon = step.icon;
              const stepStates: Record<Step, number> = {
                'info': 1, 'upload': 2, 'scanning': 3, 'code-found': 3,
                'manual': 3, 'verifying': 4, 'verified': 5, 'failed': 4
              };
              const currentNum = stepStates[currentStep] || 1;
              const isComplete = currentNum > step.num;
              const isActive = currentNum === step.num;

              return (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${
                      isComplete ? 'bg-[#00833e] text-white' :
                      isActive ? 'bg-[#00833e]/10 text-[#00833e] ring-2 ring-[#00833e]' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-medium ${
                      isComplete || isActive ? 'text-[#00833e]' : 'text-gray-400'
                    }`}>{step.label}</span>
                  </div>
                  {i < 3 && (
                    <div className={`h-0.5 w-full mx-1 mb-5 ${
                      currentNum > step.num + 1 ? 'bg-[#00833e]' :
                      currentNum > step.num ? 'bg-[#00833e]/30' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Info & e-Devlet Link */}
        {currentStep === 'info' && (
          <div className="space-y-6">
            {/* Why needed */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Otomatik Belge Doğrulama</p>
                  <p className="text-sm text-blue-800">
                    e-Devlet&apos;ten aldığınız adres belgesini yükleyin. Sistem belgedeki barkod/doğrulama kodunu otomatik okuyacak ve turkiye.gov.tr üzerinden doğrulamasını yapacak.
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
                  <h2 className="text-lg font-bold text-[#333] mb-2">1. e-Devlet&apos;ten Adres Belgesi Alın</h2>
                  <p className="text-[#666] text-sm mb-4">
                    e-Devlet hesabınıza giriş yapın ve &quot;Yerleşim Yeri ve Diğer Adres Belgesi&quot; hizmetinden belgenizi indirin.
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

            {/* Upload section */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">2. Belgeyi Yükleyin</h2>
                  <p className="text-[#666] text-sm mb-4">
                    İndirdiğiniz PDF belgeyi veya ekran görüntüsünü yükleyin. Barkod otomatik okunacak.
                  </p>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-[#00833e] bg-[#00833e]/5 scale-[1.02]'
                        : 'border-[#e0e0e0] hover:border-[#00833e]/50 hover:bg-gray-50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ScanBarcode className="w-10 h-10 text-[#8f8f8f] mx-auto mb-3" />
                    <p className="font-semibold text-[#333] mb-1">Belgeyi Sürükleyip Bırakın</p>
                    <p className="text-sm text-[#666] mb-3">
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

            {/* Manual entry option */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#333] mb-2">Kodu Kendiniz de Girebilirsiniz</h2>
                  <p className="text-[#666] text-sm mb-4">
                    Belgenizdeki barkod numarasını biliyorsanız doğrudan girebilirsiniz.
                  </p>
                  <button
                    onClick={() => setCurrentStep('manual')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#00833e] hover:text-[#006b32]"
                  >
                    Manuel Kod Girişi
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanning State */}
        {currentStep === 'scanning' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ScanBarcode className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Belge Taranıyor</h2>
              <p className="text-[#666] mb-6">{scanStatus}</p>

              {/* File info */}
              {uploadedFile && (
                <div className="bg-gray-50 rounded-lg p-3 mb-6 inline-flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#666]" />
                  <span className="text-sm text-[#666]">{uploadedFile.name}</span>
                  <span className="text-xs text-[#8f8f8f]">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}

              {/* Progress bar */}
              <div className="max-w-sm mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs text-[#8f8f8f]">{scanProgress}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Code Found */}
        {currentStep === 'code-found' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#e6f4ec] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[#00833e]" />
                </div>
                <h2 className="text-xl font-bold text-[#333] mb-2">Doğrulama Kodu Bulundu!</h2>
                <p className="text-[#666] mb-6">Belgenizdeki barkod numarası otomatik olarak okundu.</p>

                {/* Extracted code display */}
                <div className="bg-gradient-to-r from-[#00833e]/5 to-[#006b32]/5 border-2 border-[#00833e] rounded-xl p-6 mb-6">
                  <p className="text-xs text-[#666] mb-2 uppercase tracking-wider font-medium">Barkod / Doğrulama Kodu</p>
                  <p className="text-3xl font-bold text-[#00833e] font-mono tracking-wider break-all">{extractedCode}</p>
                </div>

                <p className="text-sm text-[#666] mb-6">
                  Bu kod <strong>turkiye.gov.tr/belge-dogrulama</strong> üzerinden otomatik doğrulanacak.
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => verifyCode(extractedCode)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00833e] text-white font-semibold rounded-lg hover:bg-[#006b32] transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Otomatik Doğrula
                  </button>
                  <button
                    onClick={() => setCurrentStep('manual')}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#e0e0e0] text-[#666] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Kodu Düzenle
                  </button>
                </div>
              </div>
            </div>

            {uploadedFile && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 justify-center">
                <FileText className="w-4 h-4 text-[#666]" />
                <span className="text-sm text-[#666]">{uploadedFile.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Verifying State */}
        {currentStep === 'verifying' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Belge Doğrulanıyor</h2>
              <p className="text-[#666] mb-6">{scanStatus}</p>

              {/* Verification steps animation */}
              <div className="max-w-md mx-auto space-y-3 text-left mb-6">
                {[
                  { label: 'turkiye.gov.tr/belge-dogrulama açılıyor', done: scanProgress >= 20 },
                  { label: `Barkod numarası giriliyor: ${extractedCode || manualCode}`, done: scanProgress >= 40 },
                  { label: 'Belge doğrulanıyor...', done: scanProgress >= 80 },
                  { label: 'Sonuç alınıyor', done: scanProgress >= 100 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00833e] flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                        {scanProgress >= (i * 25) && !item.done && (
                          <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                        )}
                      </div>
                    )}
                    <span className={`text-sm ${item.done ? 'text-[#333]' : 'text-[#8f8f8f]'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="max-w-sm mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verified Success */}
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

              {/* Verification details */}
              {verificationResult.details && (
                <div className="bg-[#f0f2f5] rounded-xl p-5 mb-6">
                  <h3 className="font-semibold text-[#333] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Belge Bilgileri
                  </h3>
                  <div className="space-y-2">
                    {verificationResult.details.documentType && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Belge Türü:</span>
                        <span className="text-[#333] font-medium">{verificationResult.details.documentType}</span>
                      </div>
                    )}
                    {verificationResult.details.issueDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Tarih:</span>
                        <span className="text-[#333] font-medium">{verificationResult.details.issueDate}</span>
                      </div>
                    )}
                    {verificationResult.details.neighborhood && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Mahalle:</span>
                        <span className="text-[#333] font-medium">{verificationResult.details.neighborhood}</span>
                      </div>
                    )}
                    {verificationResult.details.district && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">İlçe:</span>
                        <span className="text-[#333] font-medium">{verificationResult.details.district}</span>
                      </div>
                    )}
                    {verificationResult.details.city && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">İl:</span>
                        <span className="text-[#333] font-medium">{verificationResult.details.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Verification badge */}
              <div className="bg-[#e6f4ec] border border-[#00833e] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00833e] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#00833e] text-sm">e-Devlet ile Doğrulanmış Komşu</p>
                    <p className="text-xs text-[#666]">Belge doğrulaması: {extractedCode || manualCode}</p>
                  </div>
                </div>
              </div>

              {/* Verification URL */}
              {verificationResult.verificationUrl && (
                <div className="text-center mb-6">
                  <a
                    href={verificationResult.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32]"
                  >
                    <Eye className="w-4 h-4" />
                    turkiye.gov.tr üzerinden doğrulamayı gör
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

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

        {/* Failed State */}
        {currentStep === 'failed' && (
          <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-2">Doğrulama Başarısız</h2>
              <p className="text-[#666] mb-2">{errorMessage}</p>
              <p className="text-sm text-[#8f8f8f] mb-6">
                Kullanılan kod: <span className="font-mono">{extractedCode || manualCode}</span>
              </p>

              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setCurrentStep('manual')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Kodu Manuel Gir
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

        {/* Manual Code Entry */}
        {currentStep === 'manual' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-[#333] mb-2">Doğrulama Kodunu Girin</h2>
                <p className="text-[#666] text-sm">
                  e-Devlet belgenizde bulunan barkod numarasını veya doğrulama kodunu aşağıya girin.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label htmlFor="verification-code" className="block text-sm font-semibold text-[#333] mb-2">
                    Barkod / Doğrulama Kodu
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    value={manualCode || extractedCode}
                    onChange={(e) => {
                      setManualCode(e.target.value);
                      setExtractedCode('');
                    }}
                    placeholder="Belgedeki barkod numarasını girin"
                    className="w-full px-4 py-3.5 border-2 border-[#e0e0e0] rounded-xl text-lg font-mono tracking-wider text-center focus:outline-none focus:border-[#00833e] bg-[#f9f9f9] focus:bg-white transition-colors"
                    autoComplete="off"
                  />
                  <p className="text-xs text-[#8f8f8f] mt-2">
                    Bu numara genellikle belgenin alt kısmında barkod altında veya belge üst kısmında yer alır.
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
                <button
                  onClick={resetProcess}
                  className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Belge yükleyerek tekrar dene
                </button>
              </div>
            </div>

            {/* Help card */}
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-5">
              <h3 className="font-semibold text-[#333] mb-2">Barkod numarasını nerede bulabilirim?</h3>
              <p className="text-sm text-[#666]">
                e-Devlet&apos;ten aldığınız &quot;Yerleşim Yeri ve Diğer Adres Belgesi&quot; PDF dosyasında, belgenin alt kısmında bir barkod ve yanında doğrulama numarası bulunur. Bu numarayı yukarıdaki alana girin.
              </p>
            </div>
          </div>
        )}

        {/* Alternative: Referral code */}
        {(currentStep === 'info' || currentStep === 'manual' || currentStep === 'failed') && (
          <div className="mt-6 bg-white rounded-xl border border-[#e0e0e0] p-5">
            <h3 className="font-semibold text-[#333] mb-2">Alternatif: Referans Kodu</h3>
            <p className="text-sm text-[#666] mb-3">
              Bir komşunuzdan aldığınız referans kodu ile de doğrulama yapabilirsiniz.
            </p>
            <Link
              href="/referans-kullan"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#00833e] hover:text-[#006b32]"
            >
              Referans Kodu Kullan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
