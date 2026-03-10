'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Step = 'upload' | 'confirm' | 'waiting';

export default function AddressVerificationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      setCurrentStep('confirm');
    }
  };

  const handleConfirmSubmit = () => {
    setCurrentStep('waiting');
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
          <p className="text-[#666]">Komşu uygulamasını kullanmak için adresinizi e-Devlet aracılığıyla doğrulayın.</p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Neden Adres Doğrulaması Gerekiyor?</p>
              <p className="text-sm text-blue-800">
                Topluluk güvenliğini sağlamak ve kötüye kullanımı önlemek için tüm kullanıcılarımızın adreslerini e-Devlet aracılığıyla doğruluyoruz. İşlem tamamen ücretsizdir.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: e-Devlet'e Git */}
        {(currentStep === 'upload' || currentStep === 'confirm' || currentStep === 'waiting') && (
          <div className={`bg-white rounded-lg border p-6 mb-6 ${currentStep !== 'upload' ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#333] mb-2">e-Devlet'e Git</h2>
                <p className="text-[#666] mb-4">
                  Aşağıdaki bağlantıya tıklayarak e-Devlet hesabınızla giriş yapın ve adres belgesi alın.
                </p>
                <a
                  href="https://www.turkiye.gov.tr/nvi-yerlesim-yeri-ve-diger-adres-belgesi-sorgulama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  e-Devlet'e Git
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-xs text-[#666] mt-3">
                  İpucu: İndirdiğiniz PDF belgede sol üst köşede NVI-XXXXXXXX formatında bir kod bulunur. Bunu yazınız.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Belge Yükle */}
        {(currentStep === 'upload' || currentStep === 'confirm' || currentStep === 'waiting') && (
          <div className={`bg-white rounded-lg border p-6 mb-6 ${currentStep !== 'upload' ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#333] mb-2">Belge Yükle</h2>
                <p className="text-[#666] mb-4">
                  e-Devlet'ten aldığınız adres belgesinin fotoğrafını veya PDF'ini yükleyin.
                </p>

                {!uploadedFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-[#00833e] bg-[#f0f2f5]' : 'border-[#e0e0e0]'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-[#8f8f8f] mx-auto mb-3" />
                    <p className="font-semibold text-[#333] mb-2">Belgeyi Yükleyin</p>
                    <p className="text-sm text-[#666] mb-4">
                      Sürükleyip bırakın veya <span className="text-[#00833e] font-medium">tıklayarak seçin</span>
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center gap-2 px-4 py-2 border border-[#00833e] text-[#00833e] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors">
                        Dosya Seç
                      </span>
                    </label>
                    <p className="text-xs text-[#8f8f8f] mt-3">PNG, JPG, PDF - En fazla 10 MB</p>
                  </div>
                ) : (
                  <div className="bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00833e]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#333] truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-[#666]">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="px-3 py-1 text-sm font-medium text-[#666] border border-[#e0e0e0] rounded hover:bg-white transition-colors"
                    >
                      Değiştir
                    </button>
                  </div>
                )}

                {uploadedFile && currentStep === 'upload' && (
                  <button
                    onClick={handleUploadSubmit}
                    className="mt-4 w-full px-4 py-2 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                  >
                    Devam Et
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Onay */}
        {(currentStep === 'confirm' || currentStep === 'waiting') && (
          <div className={`bg-white rounded-lg border p-6 mb-6 ${currentStep !== 'confirm' ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#333] mb-2">Doğrulama Kodunu Girin</h2>
                <p className="text-[#666] mb-4">
                  Yüklediğiniz belgede bulunan NVI kodunu girin.
                </p>

                <input
                  type="text"
                  placeholder="NVI-XXXXXXXX"
                  defaultValue="NVI-1234567890"
                  disabled={currentStep === 'waiting'}
                  className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg font-mono text-center text-lg mb-4 focus:outline-none focus:border-[#00833e]"
                />

                {currentStep === 'confirm' && (
                  <button
                    onClick={handleConfirmSubmit}
                    className="w-full px-4 py-2 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                  >
                    Doğrulamayı Tamamla
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Bekleme */}
        {currentStep === 'waiting' && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#00833e] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#333] mb-2">Doğrulama Bekleniyor</h2>
                <p className="text-[#666] mb-4">
                  Belgeniz inceleniyor. Doğrulama işlemi genellikle 2-3 iş günü sürer.
                </p>

                <div className="bg-[#f0f2f5] rounded-lg p-4 flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#f59e0b] flex-shrink-0 animate-spin" />
                  <p className="text-[#333] font-medium">Belgeniz inceleniyor...</p>
                </div>

                <p className="text-sm text-[#666] mb-4">
                  Doğrulama tamamlandığında e-posta yoluyla size bildirim göndereceğiz.
                </p>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00833e] text-white font-medium rounded-lg hover:bg-[#006b32] transition-colors"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
