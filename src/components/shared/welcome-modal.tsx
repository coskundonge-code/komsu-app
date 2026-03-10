'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  ShoppingBag,
  Calendar,
  Store,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

export function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has already completed onboarding
    const onboardingComplete = localStorage.getItem('komsu-onboarding-complete');
    setIsLoaded(true);
    if (!onboardingComplete) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('komsu-onboarding-complete', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isLoaded || !isVisible) return null;

  const steps = [
    {
      title: 'Hoş geldin!',
      icon: null,
      content: (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00833e] rounded-full mb-4">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">KomşuApp</h2>
          <p className="text-gray-600 leading-relaxed">
            Mahallenizin sosyal ağına hoş geldiniz. Komşularınızla bağlantı kurun,
            birlikte alışveriş yapın ve etkinliklere katılın.
          </p>
        </div>
      ),
    },
    {
      title: 'Neler yapabilirsin?',
      icon: null,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#f0f2f5]">
                <Users size={24} className="text-[#00833e]" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Komşularla tanış</h3>
              <p className="text-sm text-gray-600">
                Mahallenizde yaşayan kişilerle bağlantı kurun ve birbiriyle tanışın
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#f0f2f5]">
                <ShoppingBag size={24} className="text-[#00833e]" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Alışveriş yap</h3>
              <p className="text-sm text-gray-600">
                Komşu işletmelerinden ürün ve hizmet satın alın
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#f0f2f5]">
                <Calendar size={24} className="text-[#00833e]" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Etkinliklere katıl</h3>
              <p className="text-sm text-gray-600">
                Mahallenizde düzenlenen etkinlikleri keşfedin ve katılın
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#f0f2f5]">
                <Store size={24} className="text-[#00833e]" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">İşletmeleri keşfet</h3>
              <p className="text-sm text-gray-600">
                Mahallenizin en iyi işletmelerini bulun ve destekleyin
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Hadi başlayalım!',
      icon: null,
      content: (
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Keşfetmeye Hazır mısın?
            </h3>
            <p className="text-gray-600">
              KomşuApp'ı keşfetmeye ve mahallenizdeki insanlar ve işletmelerle
              bağlantı kurmaya başla.
            </p>
          </div>

          <div className="bg-[#f0f2f5] rounded-lg p-4">
            <p className="text-sm text-gray-700">
              İstediğin zaman profil ayarlarından bu kılavuzu tekrar görebilirsin.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Kapat"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentStepData.title}
            </h2>

            {/* Step Content */}
            <div className="mb-8">
              {currentStepData.content}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 px-8 pb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[#00833e]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Adım ${index + 1}`}
              />
            ))}
          </div>

          {/* Button Group */}
          <div className="flex items-center gap-3 px-8 pb-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white font-medium transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Geri
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00833e] text-white rounded-lg hover:bg-[#006b32] font-medium transition-colors text-sm shadow-md hover:shadow-lg"
            >
              {currentStep === 2 ? 'Başla' : 'İleri'}
              {currentStep < 2 && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
