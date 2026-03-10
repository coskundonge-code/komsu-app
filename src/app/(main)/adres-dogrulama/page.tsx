'use client';

import { useState, useRef } from 'react';
import {
  Shield,
  CheckCircle,
  Upload,
  ExternalLink,
  Clock,
  AlertCircle,
  Camera,
  Loader,
} from 'lucide-react';
import {
  initiateVerification,
  uploadBarcodeImage,
  verifyBarcode,
  extractBarcodeFromImage,
} from '@/lib/services/address-verification';
import { VerifiedBadge } from '@/components/verification/verified-badge';

type VerificationStep = 'e-devlet' | 'upload' | 'verify' | 'success' | 'error';

interface VerificationState {
  currentStep: VerificationStep;
  verificationId?: string;
  barcodeValue?: string;
  errorMessage?: string;
  daysRemaining: number;
  isLoading: boolean;
  uploadProgress: number;
}

export default function AddressVerificationPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<VerificationState>({
    currentStep: 'e-devlet',
    daysRemaining: 30,
    isLoading: false,
    uploadProgress: 0,
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Adım göstergesi
  const steps = [
    { id: 'e-devlet', label: 'e-Devlet Yönlendirmesi', icon: ExternalLink },
    { id: 'upload', label: 'Belge Yükleme', icon: Upload },
    { id: 'verify', label: 'Doğrulama', icon: Loader },
  ];

  // e-Devlet'e yönlendir
  const handleRedirectToEDevlet = () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Doğrulama kaydını başlat
    initiateVerification('user_123').then((record) => {
      setState((prev) => ({
        ...prev,
        currentStep: 'upload',
        verificationId: record.id,
        isLoading: false,
      }));

      // Gerçek uygulamada:
      // window.open('https://www.turkiye.gov.tr/nvi-yerlesim-yeri-belgesi', '_blank');
    });
  };

  // Dosya yükleme işlemleri
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Dosya kontrolü
    if (!file.type.startsWith('image/')) {
      setState((prev) => ({
        ...prev,
        currentStep: 'error',
        errorMessage: 'Lütfen bir görüntü dosyası yükleyin (JPG, PNG, vb.)',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        currentStep: 'error',
        errorMessage: 'Dosya boyutu 5MB\'dan küçük olmalıdır',
      }));
      return;
    }

    setUploadedFile(file);
    setState((prev) => ({ ...prev, isLoading: true, uploadProgress: 0 }));

    // Dosya yükleme simülasyonu
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setState((prev) => ({ ...prev, uploadProgress: i }));
    }

    // Dosyayı upload et
    const uploadResult = await uploadBarcodeImage(
      state.verificationId || '',
      file
    );

    if (uploadResult.success) {
      // Barkod okuma işlemini başlat
      setState((prev) => ({ ...prev, currentStep: 'verify' }));
      startBarcodeVerification(file);
    } else {
      setState((prev) => ({
        ...prev,
        currentStep: 'error',
        errorMessage: uploadResult.message,
        isLoading: false,
      }));
    }
  };

  const startBarcodeVerification = async (file: File) => {
    try {
      // Barkodu resimdeb oku
      const extractedBarcode = await extractBarcodeFromImage(file);

      if (!extractedBarcode) {
        setState((prev) => ({
          ...prev,
          currentStep: 'error',
          errorMessage:
            'Barcode okunamadı. Lütfen net ve düz bir fotoğraf çekin.',
          isLoading: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        barcodeValue: extractedBarcode,
      }));

      // Barkodu doğrula
      const verificationResult = await verifyBarcode(
        state.verificationId || '',
        extractedBarcode
      );

      if (verificationResult.success) {
        setState((prev) => ({
          ...prev,
          currentStep: 'success',
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          currentStep: 'error',
          errorMessage: verificationResult.message,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        currentStep: 'error',
        errorMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        isLoading: false,
      }));
    }
  };

  // Step göstergesi
  const getStepStatus = (stepId: string): 'completed' | 'active' | 'pending' => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep);

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  const getStepNumber = (stepId: string): number => {
    return steps.findIndex((s) => s.id === stepId) + 1;
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-[#00833e]" />
              <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-[#00833e] fill-[#00833e]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#333] mb-2">
            Adresinizi Doğrulayın
          </h1>
          <p className="text-[#8f8f8f] max-w-md mx-auto">
            Komşularınız tarafından güvenilir olmak için adresinizi doğrulayın ve
            "Onaylanmış Komşu" rozetini kazanın.
          </p>
        </div>

        {/* Süre Timer */}
        <div className="mb-6 bg-white rounded-lg border border-[#e0e0e0] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#00833e]" />
            <div>
              <p className="text-sm font-semibold text-[#333]">
                Doğrulama Süresi
              </p>
              <p className="text-xs text-[#8f8f8f]">
                Doğrulamayı tamamlamak için kalan gün
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#00833e]">
              {state.daysRemaining}
            </p>
            <p className="text-xs text-[#8f8f8f]">gün</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const stepNum = getStepNumber(step.id);
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex-1">
                  <div className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        status === 'completed'
                          ? 'bg-[#00833e] text-white'
                          : status === 'active'
                            ? 'bg-[#00833e] text-white border-4 border-[#e6f4ec]'
                            : 'bg-[#e0e0e0] text-[#8f8f8f]'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Step Label */}
                    <p
                      className={`text-xs font-semibold text-center max-w-[100px] ${
                        status === 'active' || status === 'completed'
                          ? 'text-[#333]'
                          : 'text-[#8f8f8f]'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute h-1 w-1/3 mt-5 ml-12 transition-colors ${
                        status === 'completed'
                          ? 'bg-[#00833e]'
                          : 'bg-[#e0e0e0]'
                      }`}
                      style={{
                        position: 'absolute',
                        marginTop: '-32px',
                        marginLeft: '48px',
                        width: 'calc(100% - 96px)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-6">
          {/* Step 1: e-Devlet Yönlendirmesi */}
          {state.currentStep === 'e-devlet' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#333] mb-3">
                  Adım 1: e-Devlet'e Giderek Belge Alın
                </h2>
                <p className="text-[#404040] mb-4">
                  Aşağıdaki adımları takip ederek e-Devlet üzerinden "Yerleşim
                  Yeri Belgesi" (residence certificate) almalısınız:
                </p>

                <ol className="space-y-3 ml-4 list-decimal text-[#404040]">
                  <li>
                    <strong>e-Devlet Portalı</strong>'na giriş yapın
                    (turkiye.gov.tr)
                  </li>
                  <li>
                    <strong>"Yerleşim Yeri Belgesi"</strong> hizmetini arayın
                  </li>
                  <li>
                    <strong>Başvuru yapın</strong> ve belgenizi indirin
                  </li>
                  <li>
                    Beliğin <strong>barcode</strong>'unu fotoğrafla çekin
                  </li>
                  <li>Fotoğrafı aşağıda yükleyin</li>
                </ol>
              </div>

              {/* Info Box */}
              <div className="bg-[#e6f4ec] border border-[#00833e] rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#00833e] mb-1">
                      Barcode Nerede?
                    </p>
                    <p className="text-sm text-[#00833e]">
                      Belgenin alt tarafında siyah ve beyaz çizgilerden oluşan
                      barcode bulunur. Bu barcode'u net şekilde fotoğrafla çekin.
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleRedirectToEDevlet}
                disabled={state.isLoading}
                className="w-full bg-[#00833e] text-white py-3 rounded-lg font-semibold hover:bg-[#006b32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state.isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Yönlendiriliyorsunuz...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    e-Devlet'e Gitmek İçin Tıklayın
                  </>
                )}
              </button>

              <p className="text-xs text-[#8f8f8f] text-center">
                Belgeyi indirdikten sonra "Belge Yükleme" adımına geçebilirsiniz.
              </p>
            </div>
          )}

          {/* Step 2: Belge Yükleme */}
          {state.currentStep === 'upload' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#333] mb-2">
                  Adım 2: Barcode'u Yükleyin
                </h2>
                <p className="text-[#404040] text-sm">
                  e-Devlet'ten aldığınız belgenin barcode bölümünü fotoğrafla
                  çekin ve aşağıya yükleyin.
                </p>
              </div>

              {/* Upload Area */}
              <div
                ref={dropZoneRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-[#00833e] bg-[#e6f4ec]'
                    : 'border-[#e0e0e0] bg-[#f0f2f5] hover:border-[#00833e]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {uploadedFile ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-[#00833e] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#333] mb-1">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-[#8f8f8f]">
                      ({(uploadedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-3">
                      <Camera className="h-12 w-12 text-[#8f8f8f]" />
                    </div>
                    <p className="text-sm font-semibold text-[#333] mb-1">
                      Barcode Fotoğrafını Yükleyin
                    </p>
                    <p className="text-xs text-[#8f8f8f]">
                      Sürükle ve bırak veya tıkla • JPG, PNG (Max 5MB)
                    </p>
                  </>
                )}
              </div>

              {/* Upload Progress */}
              {state.isLoading && state.uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#8f8f8f]">
                    <span>Yükleniyor...</span>
                    <span>{state.uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                    <div
                      className="bg-[#00833e] h-full rounded-full transition-all duration-300"
                      style={{ width: `${state.uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Guidance Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Başarılı Yükleme İçin İpuçları
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                      <li>Barcode'u düz açıyla ve tam olarak fotoğrafla</li>
                      <li>Işık iyi olsun, ışık yansımasından kaçının</li>
                      <li>Barcode'un tamamı görüntüde bulunmalı</li>
                      <li>Resim net ve seçik olmalı</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (uploadedFile) {
                    setState((prev) => ({
                      ...prev,
                      currentStep: 'verify',
                    }));
                    startBarcodeVerification(uploadedFile);
                  }
                }}
                disabled={!uploadedFile || state.isLoading}
                className="w-full bg-[#00833e] text-white py-3 rounded-lg font-semibold hover:bg-[#006b32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? 'Doğrulanıyor...' : 'Doğrulamaya Devam Et'}
              </button>
            </div>
          )}

          {/* Step 3: Doğrulama */}
          {state.currentStep === 'verify' && (
            <div className="space-y-6 text-center py-8">
              <Loader className="h-12 w-12 text-[#00833e] mx-auto animate-spin" />
              <div>
                <h2 className="text-xl font-semibold text-[#333] mb-2">
                  Adresiniz Doğrulanıyor
                </h2>
                <p className="text-[#8f8f8f]">
                  Lütfen bekleyin. Barcode'unuz e-Devlet sistemiyle
                  karşılaştırılıyor...
                </p>
              </div>
              <div className="w-16 h-16 bg-[#e6f4ec] rounded-full mx-auto animate-pulse" />
            </div>
          )}

          {/* Success State */}
          {state.currentStep === 'success' && (
            <div className="space-y-6 py-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#00833e] rounded-full animate-ping opacity-25"></div>
                  <CheckCircle className="h-20 w-20 text-[#00833e] relative z-10" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#333] mb-2">
                  Tebrikler!
                </h2>
                <p className="text-[#8f8f8f] mb-6">
                  Adresiniz başarıyla doğrulandı ve artık "Onaylanmış Komşu"
                  rozetini kazandınız!
                </p>
              </div>

              {/* Badge Display */}
              <div className="bg-[#e6f4ec] rounded-lg p-6 text-center">
                <p className="text-sm font-semibold text-[#333] mb-4">
                  Yeni Rozetiniz:
                </p>
                <div className="flex justify-center mb-4">
                  <VerifiedBadge variant="full" />
                </div>
                <p className="text-sm text-[#8f8f8f]">
                  Bu rozet, komşularınıza sizin gerçek adresinizle komşuluk
                  yaptığınızı gösterir.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 border-t border-[#e0e0e0] pt-6">
                <p className="text-sm font-semibold text-[#333]">
                  Bu rozet size şunları sağlar:
                </p>
                <ul className="space-y-2 text-sm text-[#404040]">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Profilinizde güven göstergesi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Komşulardan daha fazla güven alırsınız</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Pazaryerinde satış yapabilirsiniz</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#00833e] flex-shrink-0 mt-0.5" />
                    <span>Etkinlik hostluğu yapabilirsiniz</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => (window.location.href = '/profil')}
                className="w-full bg-[#00833e] text-white py-3 rounded-lg font-semibold hover:bg-[#006b32] transition-colors"
              >
                Profilimi Görüntüle
              </button>
            </div>
          )}

          {/* Error State */}
          {state.currentStep === 'error' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#333] mb-2">
                  Doğrulama Başarısız
                </h2>
                <p className="text-[#8f8f8f] mb-4">
                  {state.errorMessage ||
                    'Bir hata oluştu. Lütfen tekrar deneyin.'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setState((prev) => ({
                      ...prev,
                      currentStep: 'upload',
                      errorMessage: undefined,
                      uploadProgress: 0,
                    }));
                  }}
                  className="w-full bg-[#00833e] text-white py-3 rounded-lg font-semibold hover:bg-[#006b32] transition-colors"
                >
                  Baştan Deneyin
                </button>

                <button
                  onClick={() =>
                    (window.location.href = '/yardim')
                  }
                  className="w-full bg-[#f0f2f5] text-[#333] py-3 rounded-lg font-semibold border border-[#e0e0e0] hover:bg-[#e0e0e0] transition-colors"
                >
                  Yardım Al
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-lg border border-[#e0e0e0] p-6">
          <h3 className="text-lg font-semibold text-[#333] mb-4">
            Sıkça Sorulan Sorular
          </h3>

          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-[#333] flex items-center justify-between hover:text-[#00833e]">
                <span>e-Devlet hesabı açmak için ne gerekli?</span>
                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-[#8f8f8f]">
                e-Devlet hesabı açmak için T.C. kimlik numarası ve bir cep
                telefonu numarasınız yeterlidir. Detaylı bilgi için
                turkiye.gov.tr adresini ziyaret edin.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-[#333] flex items-center justify-between hover:text-[#00833e]">
                <span>Yerleşim Yeri Belgesi (Residence Certificate) nedir?</span>
                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-[#8f8f8f]">
                Yerleşim Yeri Belgesi, Nüfus Müdürlüğü tarafından verilen ve
                kişinin ikamet adresini kanıtlayan resmi belgedir. e-Devlet
                üzerinden ücretsiz alınabilir.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-[#333] flex items-center justify-between hover:text-[#00833e]">
                <span>Doğrulama işlemi ne kadar sürer?</span>
                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-[#8f8f8f]">
                Barcode'unuz yüklendikten sonra doğrulama işlemi genellikle 2-3
                dakika içinde tamamlanır. Daha uzun süren yüklemeler olursa
                destek ekibimize ulaşabilirsiniz.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-[#333] flex items-center justify-between hover:text-[#00833e]">
                <span>Doğrulama verilerim gizli mi kalır?</span>
                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-[#8f8f8f]">
                Evet, adresiniz tamamen gizli kalır. Yalnızca doğrulama rozetini
                görebilirler, detaylı adres bilgisi gösterilmez. Gizlilik
                politikamız için Gizlilik Sayfamızı ziyaret edin.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
