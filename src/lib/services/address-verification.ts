// @ts-nocheck
// e-Devlet Adres Doğrulama Servisi

export type VerificationStatus =
  | 'pending'
  | 'awaiting_upload'
  | 'uploaded'
  | 'verifying'
  | 'verified'
  | 'failed'
  | 'expired';

export interface VerificationResult {
  success: boolean;
  message: string;
  barcodeValid: boolean;
  verificationId?: string;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  status: VerificationStatus;
  barcodeValue?: string;
  barcodeImageUrl?: string;
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  neighborhoodId?: string;
}

/**
 * Doğrulama işlemini başlatır ve 30 günlük süre belirlenir
 * @param userId - Kullanıcı ID'si
 * @returns Yeni doğrulama kaydı
 */
export async function initiateVerification(userId: string): Promise<VerificationRecord> {
  // Veritabanında doğrulama kaydı oluştur
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 gün sonra

  const verificationRecord: VerificationRecord = {
    id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    status: 'awaiting_upload',
    createdAt: now,
    expiresAt: expiryDate,
  };

  // TODO: Veritabanına kaydet
  console.log('Doğrulama kaydı oluşturuldu:', verificationRecord);

  return verificationRecord;
}

/**
 * Barkod resmini yükler ve geçici olarak depolar
 * @param verificationId - Doğrulama ID'si
 * @param imageFile - Yüklenen görüntü dosyası
 * @returns Yükleme sonucu
 */
export async function uploadBarcodeImage(
  verificationId: string,
  imageFile: File
): Promise<VerificationResult> {
  // Dosya boyutu kontrolü (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (imageFile.size > maxSize) {
    return {
      success: false,
      message: 'Dosya boyutu 5MB\'dan küçük olmalıdır',
      barcodeValid: false,
    };
  }

  // Dosya türü kontrolü
  if (!imageFile.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Geçerli bir görüntü dosyası yükleyin (JPG, PNG, vb.)',
      barcodeValid: false,
    };
  }

  // Görüntü yükleme işlemi (örneğin cloud storage'a)
  // TODO: Dosyayı cloud storage'a yükle (Supabase, AWS S3, vb.)
  const imageUrl = URL.createObjectURL(imageFile); // Mock için geçici URL

  // Doğrulama kaydını güncelle
  console.log('Barkod resmi yüklendi:', {
    verificationId,
    fileName: imageFile.name,
    imageUrl,
  });

  return {
    success: true,
    message: 'Görüntü başarıyla yüklendi',
    barcodeValid: true,
    verificationId,
  };
}

/**
 * e-Devlet barkodunun geçerliliğini doğrular
 * Barkod formatı: NVI-XXXXXXXXXXXXXXXX (16 haneli sayı)
 * @param verificationId - Doğrulama ID'si
 * @param barcodeValue - Barkod değeri
 * @returns Doğrulama sonucu
 */
export async function verifyBarcode(
  verificationId: string,
  barcodeValue: string
): Promise<VerificationResult> {
  // Barkod formatı doğrulaması
  const barcodePattern = /^NVI-\d{16}$/;

  if (!barcodePattern.test(barcodeValue)) {
    return {
      success: false,
      message: 'Barkod formatı geçersiz. Lütfen NVI- ile başlayan ve 16 haneli sayı içeren bir barkod sağlayın.',
      barcodeValid: false,
    };
  }

  // Simüle edilmiş e-Devlet API çağrısı
  // Gerçek uygulamada, bu bir e-Devlet doğrulama endpoint'ine yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      // Rastgele olarak başarı/başarısızlığı simüle et (90% başarılı)
      const isValid = Math.random() < 0.9;

      if (isValid) {
        // Veritabanında kaydı güncelle
        console.log('Barkod doğrulandı:', {
          verificationId,
          barcodeValue,
          validatedAt: new Date(),
        });

        resolve({
          success: true,
          message: 'Barkod başarıyla doğrulandı! Adresiniz onaylanmıştır.',
          barcodeValid: true,
          verificationId,
        });
      } else {
        resolve({
          success: false,
          message: 'Barkod doğrulanamadı. Lütfen tekrar deneyin veya e-Devlet destek hattını arayın.',
          barcodeValid: false,
        });
      }
    }, 2000); // 2 saniye gecikme (API çağrısını simüle et)
  });
}

/**
 * Kullanıcının doğrulama durumunu kontrol eder
 * @param userId - Kullanıcı ID'si
 * @returns Doğrulama durumu
 */
export async function checkVerificationStatus(userId: string): Promise<VerificationRecord | null> {
  // TODO: Veritabanından kayıt getir
  console.log('Doğrulama durumu kontrol edildi:', userId);

  // Mock veri
  return null;
}

/**
 * Kullanıcıyı "Onaylanmış Komşu" olarak işaretler
 * @param userId - Kullanıcı ID'si
 * @param neighborhoodId - Mahalle ID'si
 * @returns Başarı durumu
 */
export async function approveUser(
  userId: string,
  neighborhoodId: string
): Promise<boolean> {
  // TODO: Kullanıcı profilini güncelle ve "verified" rolesini ekle
  console.log('Kullanıcı onaylandı:', {
    userId,
    neighborhoodId,
    approvedAt: new Date(),
    badge: 'Onaylanmış Komşu',
  });

  return true;
}

/**
 * Süresi dolmak üzere olan doğrulamaları getirir
 * (İsteğe bağlı - otomatik temizlik için)
 * @returns Süresi dolmak üzere olan doğrulama kayıtları
 */
export async function getExpiringVerifications(): Promise<VerificationRecord[]> {
  // TODO: Veritabanından süresi dolmak üzere olan kayıtları getir
  console.log('Süresi dolmak üzere olan doğrulamalar kontrol edildi');

  return [];
}

/**
 * Barkod resminden barkod değerini okumaya çalışır
 * (Gerçek uygulamada OCR/barkod okuma kütüphanesi kullanılacak)
 * @param imageFile - Barkod görüntüsü
 * @returns Okunan barkod değeri veya hata
 */
export async function extractBarcodeFromImage(imageFile: File): Promise<string | null> {
  // Mock: Görüntü yüklenir ve barkod değeri simüle edilir
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Gerçek uygulamada:
      // - Barcode.js veya quagga.js gibi barkod okuma kütüphanesi kullanılır
      // - OCR işlemi yapılır (Tesseract.js vb.)

      // Mock için rastgele geçerli bir barkod döndür
      setTimeout(() => {
        const mockBarcodes = [
          'NVI-1234567890123456',
          'NVI-9876543210987654',
          'NVI-5555555555555555',
        ];
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        console.log('Barkod okundu:', randomBarcode);
        resolve(randomBarcode);
      }, 1500);
    };

    reader.readAsDataURL(imageFile);
  });
}
