"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Cloud,
  AlertTriangle,
  Zap,
  Droplets,
  Flame,
  Lock,
  PawPrint,
  HelpCircle,
  Car,
  ChevronRight,
  Eye,
  Calendar,
  Radius,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const alertTypes = [
  { value: "weather", label: "Hava Durumu", icon: Cloud },
  { value: "traffic", label: "Trafik", icon: Car },
  { value: "power", label: "Elektrik Kesintisi", icon: Zap },
  { value: "water", label: "Su Kesintisi", icon: Droplets },
  { value: "gas", label: "Doğalgaz", icon: Zap },
  { value: "fire", label: "Yangın", icon: Flame },
  { value: "security", label: "Hırsızlık/Güvenlik", icon: Lock },
  { value: "pet", label: "Kayıp Evcil Hayvan", icon: PawPrint },
  { value: "other", label: "Diğer", icon: HelpCircle },
];

const severityOptions = [
  {
    value: "low",
    label: "Düşük",
    subtitle: "bilgi",
    bgColor: "#3b82f6",
    lightBg: "#eff6ff",
    textColor: "#1e40af",
    borderColor: "#93c5fd",
  },
  {
    value: "medium",
    label: "Orta",
    subtitle: "dikkat",
    bgColor: "#f59e0b",
    lightBg: "#fffbeb",
    textColor: "#92400e",
    borderColor: "#fcd34d",
  },
  {
    value: "high",
    label: "Yüksek",
    subtitle: "acil",
    bgColor: "#ef4444",
    lightBg: "#fef2f2",
    textColor: "#991b1b",
    borderColor: "#fca5a5",
  },
  {
    value: "critical",
    label: "Kritik",
    subtitle: "tehlike",
    bgColor: "#dc2626",
    lightBg: "#fef2f2",
    textColor: "#7f1d1d",
    borderColor: "#fecaca",
  },
];

const neighborhoods = [
  "Beşiktaş",
  "Şişli",
  "Kağıthane",
  "Sarıyer",
  "Eyüpsultan",
  "Fatih",
  "Eminönü",
  "Beyoğlu",
  "Bakırköy",
  "Zeytinburnu",
];

export default function NewAlertPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [alertType, setAlertType] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [radius, setRadius] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationTime, setExpirationTime] = useState("23:59");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const titleCharLimit = 100;
  const descriptionCharLimit = 500;

  const getSeverityColor = (value: string) => {
    return severityOptions.find((opt) => opt.value === value);
  };

  const getAlertTypeIcon = (value: string) => {
    const type = alertTypes.find((t) => t.value === value);
    return type ? type.icon : HelpCircle;
  };

  const canGoNext = () => {
    if (currentStep === 1) return alertType !== "";
    if (currentStep === 2)
      return title.trim() !== "" && description.trim() !== "";
    if (currentStep === 3) return neighborhood !== "" && expirationDate !== "";
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    router.push("/uyarilar");
  };

  const stepContent = {
    1: (
      <div>
        <h2 className="text-xl font-bold text-[#333] mb-6">
          Uyarı Türünü Seçin
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {alertTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setAlertType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  alertType === type.value
                    ? "border-[#00833e] bg-[#f0f2f5]"
                    : "border-[#e0e0e0] hover:border-[#00833e]"
                }`}
              >
                <IconComponent
                  size={24}
                  className={`mx-auto mb-2 ${
                    alertType === type.value
                      ? "text-[#00833e]"
                      : "text-[#8f8f8f]"
                  }`}
                />
                <p className="text-xs font-medium text-[#333] text-center">
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    ),

    2: (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#333] mb-4">
            Uyarı Detaylarını Girin
          </h2>
          <div className="bg-white rounded-lg border border-[#e0e0e0] p-4 mb-6">
            <p className="text-sm text-[#8f8f8f] mb-2">Seçilen Tür:</p>
            <div className="flex items-center gap-2">
              {(() => {
                const IconComponent = getAlertTypeIcon(alertType);
                return (
                  <>
                    <IconComponent size={20} className="text-[#00833e]" />
                    <span className="font-medium text-[#333]">
                      {alertTypes.find((t) => t.value === alertType)?.label}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Severity Selector */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-3">
            Önem Derecesi
          </label>
          <div className="grid grid-cols-2 gap-3">
            {severityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeverity(opt.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  severity === opt.value
                    ? `border-[${opt.bgColor}]`
                    : "border-[#e0e0e0]"
                }`}
                style={{
                  backgroundColor:
                    severity === opt.value ? opt.lightBg : "transparent",
                  borderColor:
                    severity === opt.value ? opt.bgColor : "#e0e0e0",
                }}
              >
                <p
                  className="font-semibold text-sm"
                  style={{
                    color:
                      severity === opt.value
                        ? opt.textColor
                        : "#8f8f8f",
                  }}
                >
                  {opt.label}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color:
                      severity === opt.value
                        ? opt.textColor
                        : "#8f8f8f",
                  }}
                >
                  {opt.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1.5">
            Başlık
          </label>
          <input
            type="text"
            maxLength={titleCharLimit}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Uyarı başlığı yazın..."
            className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
          />
          <p className="text-xs text-[#8f8f8f] mt-1">
            {title.length} / {titleCharLimit}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-1.5">
            Açıklama
          </label>
          <textarea
            maxLength={descriptionCharLimit}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detaylı açıklama yazın..."
            rows={4}
            className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] placeholder-[#8f8f8f] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e] resize-none"
          />
          <p className="text-xs text-[#8f8f8f] mt-1">
            {description.length} / {descriptionCharLimit}
          </p>
        </div>
      </div>
    ),

    3: (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#333]">Konum ve Zaman</h2>

        {/* Neighborhood Selection */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-2">
            Mahalle Seçin
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
          >
            <option value="">Mahalle seçin...</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#8f8f8f] mt-1">
            Uyarının geçerli olacağı mahalle
          </p>
        </div>

        {/* Radius Slider */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-3">
            Etki Alanı
          </label>
          <div className="flex items-center gap-4">
            <Radius size={20} className="text-[#00833e]" />
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-[#333] min-w-fit">
              {radius}km
            </span>
          </div>
          <p className="text-xs text-[#8f8f8f] mt-2">
            Uyarı bu mahallenin {radius}km içindeki kullanıcılara bildirilecek
          </p>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-40 bg-[#f0f2f5] border border-[#e0e0e0] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="mx-auto mb-2 text-[#8f8f8f]" />
            <p className="text-sm text-[#8f8f8f]">Harita Ön İzlemesi</p>
          </div>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block text-sm font-medium text-[#333] mb-2">
            Uyarı Geçerliliği
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8f8f8f] mb-1">
                Tarih
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8f8f8f] mb-1">
                Saat
              </label>
              <input
                type="time"
                value={expirationTime}
                onChange={(e) => setExpirationTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded-lg text-[#333] focus:outline-none focus:border-[#00833e] focus:ring-1 focus:ring-[#00833e]"
              />
            </div>
          </div>
          <p className="text-xs text-[#8f8f8f] mt-1">
            Uyarı bu tarih ve saate kadar geçerli olacak
          </p>
        </div>
      </div>
    ),

    4: (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#333] mb-4">Ön İzleme</h2>

        {/* Alert Preview Card */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          {/* Header with severity */}
          <div
            style={{
              backgroundColor: getSeverityColor(severity)?.lightBg,
              borderBottom: `3px solid ${getSeverityColor(severity)?.bgColor}`,
            }}
            className="p-4"
          >
            <div className="flex items-start gap-3">
              <div
                style={{
                  backgroundColor: getSeverityColor(severity)?.bgColor,
                  color: "white",
                }}
                className="p-2 rounded-lg"
              >
                {(() => {
                  const IconComponent = getAlertTypeIcon(alertType);
                  return <IconComponent size={20} />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#333] text-lg">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    style={{
                      backgroundColor: getSeverityColor(severity)?.bgColor,
                      color: "white",
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded"
                  >
                    {getSeverityColor(severity)?.label}
                  </span>
                  <span className="text-xs text-[#8f8f8f]">
                    {alertTypes.find((t) => t.value === alertType)?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-[#333] line-clamp-3">
              {description || "Açıklama yazılmadı..."}
            </p>

            {/* Location and Time Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#8f8f8f]">
                <MapPin size={16} />
                <span>{neighborhood} - {radius}km etki alanı</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8f8f8f]">
                <Calendar size={16} />
                <span>
                  {expirationDate ? `${expirationDate} ${expirationTime}` : "Tarih seçilmedi"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#f0f2f5] px-4 py-3 border-t border-[#e0e0e0]">
            <p className="text-xs text-[#8f8f8f]">
              Paylaşıldığında bölgedeki komşularınıza bildirim gönderilecek
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#f0f2f5] rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-[#333]">Özet:</p>
          <ul className="text-sm text-[#8f8f8f] space-y-1">
            <li>
              • <span className="font-medium">Tür:</span>{" "}
              {alertTypes.find((t) => t.value === alertType)?.label}
            </li>
            <li>
              • <span className="font-medium">Önem:</span>{" "}
              {getSeverityColor(severity)?.label}
            </li>
            <li>
              • <span className="font-medium">Konum:</span> {neighborhood} - {radius}km
            </li>
            <li>
              • <span className="font-medium">Bitiş:</span> {expirationDate} {expirationTime}
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/uyarilar"
          className="inline-flex items-center gap-2 text-sm text-[#00833e] hover:text-[#006b32] font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Uyarılara Dön
        </Link>

        <div className="bg-white rounded-lg border border-[#e0e0e0] p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[
                { num: 1, label: "Tür Seçimi" },
                { num: 2, label: "Detaylar" },
                { num: 3, label: "Konum" },
                { num: 4, label: "Önizleme" },
              ].map((step, idx, arr) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        currentStep >= step.num
                          ? "bg-[#00833e] text-white"
                          : "bg-[#e0e0e0] text-[#8f8f8f]"
                      }`}
                    >
                      {step.num}
                    </div>
                    <p
                      className={`text-xs mt-2 font-medium text-center w-16 ${
                        currentStep >= step.num
                          ? "text-[#00833e]"
                          : "text-[#8f8f8f]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-colors ${
                        currentStep > step.num
                          ? "bg-[#00833e]"
                          : "bg-[#e0e0e0]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {stepContent[currentStep as keyof typeof stepContent]}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2.5 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors"
                >
                  Geri
                </button>
              )}

              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canGoNext()}
                  className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto ${
                    canGoNext()
                      ? "bg-[#00833e] hover:bg-[#006b32] text-white"
                      : "bg-[#e0e0e0] text-[#8f8f8f] cursor-not-allowed"
                  }`}
                >
                  İleri
                  <ChevronRight size={16} />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto"
                >
                  <Eye size={16} />
                  Uyarıyı Paylaş
                </button>
              )}

              <Link
                href="/uyarilar"
                className="px-6 py-2.5 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#f0f2f5" }}
              >
                <AlertTriangle size={24} className="text-[#00833e]" />
              </div>
              <h3 className="text-lg font-bold text-[#333] mb-2">
                Uyarıyı Paylaş?
              </h3>
              <p className="text-sm text-[#8f8f8f] mb-6">
                Bu uyarı bölgedeki komşularınıza bildirim olarak gönderilecek.
                Paylaşmak istediğinizden emin misiniz?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2.5 border border-[#e0e0e0] text-[#333] font-medium rounded-lg hover:bg-[#f0f2f5] transition-colors"
                >
                  İptal Et
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#00833e] hover:bg-[#006b32] text-white font-medium rounded-lg transition-colors"
                >
                  Evet, Paylaş
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
