/**
 * Türkiye il ve ilçe verileri (koordinatlarla birlikte)
 * Konum seçimi sayfasında il/ilçe dropdown'ları ve harita navigasyonu için kullanılır.
 */

export interface Province {
  name: string
  lat: number
  lng: number
  districts: District[]
}

export interface District {
  name: string
  lat: number
  lng: number
}

export const provinces: Province[] = [
  { name: 'Adana', lat: 37.0, lng: 35.32, districts: [
    { name: 'Seyhan', lat: 36.98, lng: 35.32 }, { name: 'Yüreğir', lat: 37.0, lng: 35.39 },
    { name: 'Çukurova', lat: 37.02, lng: 35.38 }, { name: 'Sarıçam', lat: 37.06, lng: 35.45 },
    { name: 'Ceyhan', lat: 37.03, lng: 35.81 }, { name: 'Kozan', lat: 37.45, lng: 35.82 },
  ]},
  { name: 'Adıyaman', lat: 37.76, lng: 38.28, districts: [
    { name: 'Merkez', lat: 37.76, lng: 38.28 }, { name: 'Kahta', lat: 37.79, lng: 38.62 },
  ]},
  { name: 'Afyonkarahisar', lat: 38.73, lng: 30.54, districts: [
    { name: 'Merkez', lat: 38.73, lng: 30.54 }, { name: 'Sandıklı', lat: 38.46, lng: 30.29 },
  ]},
  { name: 'Ağrı', lat: 39.72, lng: 43.05, districts: [
    { name: 'Merkez', lat: 39.72, lng: 43.05 }, { name: 'Doğubayazıt', lat: 39.65, lng: 44.09 },
  ]},
  { name: 'Amasya', lat: 40.65, lng: 35.83, districts: [
    { name: 'Merkez', lat: 40.65, lng: 35.83 },
  ]},
  { name: 'Ankara', lat: 39.93, lng: 32.86, districts: [
    { name: 'Çankaya', lat: 39.91, lng: 32.86 }, { name: 'Keçiören', lat: 39.97, lng: 32.86 },
    { name: 'Mamak', lat: 39.93, lng: 32.92 }, { name: 'Yenimahalle', lat: 39.96, lng: 32.81 },
    { name: 'Etimesgut', lat: 39.95, lng: 32.68 }, { name: 'Sincan', lat: 39.97, lng: 32.58 },
    { name: 'Altındağ', lat: 39.95, lng: 32.87 }, { name: 'Pursaklar', lat: 40.03, lng: 32.9 },
    { name: 'Gölbaşı', lat: 39.78, lng: 32.8 }, { name: 'Polatlı', lat: 39.58, lng: 32.15 },
  ]},
  { name: 'Antalya', lat: 36.9, lng: 30.7, districts: [
    { name: 'Muratpaşa', lat: 36.88, lng: 30.71 }, { name: 'Kepez', lat: 36.94, lng: 30.72 },
    { name: 'Konyaaltı', lat: 36.87, lng: 30.64 }, { name: 'Aksu', lat: 36.92, lng: 30.83 },
    { name: 'Alanya', lat: 36.54, lng: 32.0 }, { name: 'Manavgat', lat: 36.79, lng: 31.44 },
    { name: 'Kaş', lat: 36.2, lng: 29.64 }, { name: 'Kemer', lat: 36.6, lng: 30.56 },
    { name: 'Side (Manavgat)', lat: 36.77, lng: 31.39 },
  ]},
  { name: 'Artvin', lat: 41.18, lng: 41.82, districts: [{ name: 'Merkez', lat: 41.18, lng: 41.82 }]},
  { name: 'Aydın', lat: 37.84, lng: 27.85, districts: [
    { name: 'Efeler', lat: 37.84, lng: 27.85 }, { name: 'Kuşadası', lat: 37.86, lng: 27.26 },
    { name: 'Didim', lat: 37.37, lng: 27.27 }, { name: 'Nazilli', lat: 37.91, lng: 28.32 },
  ]},
  { name: 'Balıkesir', lat: 39.65, lng: 27.89, districts: [
    { name: 'Altıeylül', lat: 39.65, lng: 27.88 }, { name: 'Karesi', lat: 39.65, lng: 27.89 },
    { name: 'Ayvalık', lat: 39.31, lng: 26.69 }, { name: 'Bandırma', lat: 40.35, lng: 27.97 },
    { name: 'Edremit', lat: 39.6, lng: 27.02 },
  ]},
  { name: 'Bilecik', lat: 40.05, lng: 30.0, districts: [{ name: 'Merkez', lat: 40.05, lng: 30.0 }]},
  { name: 'Bingöl', lat: 38.88, lng: 40.49, districts: [{ name: 'Merkez', lat: 38.88, lng: 40.49 }]},
  { name: 'Bitlis', lat: 38.4, lng: 42.11, districts: [{ name: 'Merkez', lat: 38.4, lng: 42.11 }]},
  { name: 'Bolu', lat: 40.73, lng: 31.61, districts: [{ name: 'Merkez', lat: 40.73, lng: 31.61 }]},
  { name: 'Burdur', lat: 37.72, lng: 30.29, districts: [{ name: 'Merkez', lat: 37.72, lng: 30.29 }]},
  { name: 'Bursa', lat: 40.19, lng: 29.06, districts: [
    { name: 'Osmangazi', lat: 40.19, lng: 29.06 }, { name: 'Nilüfer', lat: 40.21, lng: 28.94 },
    { name: 'Yıldırım', lat: 40.19, lng: 29.11 }, { name: 'Görükle', lat: 40.24, lng: 28.87 },
    { name: 'Mudanya', lat: 40.38, lng: 28.88 }, { name: 'Gemlik', lat: 40.43, lng: 29.16 },
    { name: 'İnegöl', lat: 40.08, lng: 29.51 },
  ]},
  { name: 'Çanakkale', lat: 40.15, lng: 26.41, districts: [
    { name: 'Merkez', lat: 40.15, lng: 26.41 }, { name: 'Gelibolu', lat: 40.41, lng: 26.67 },
  ]},
  { name: 'Çankırı', lat: 40.6, lng: 33.62, districts: [{ name: 'Merkez', lat: 40.6, lng: 33.62 }]},
  { name: 'Çorum', lat: 40.55, lng: 34.96, districts: [{ name: 'Merkez', lat: 40.55, lng: 34.96 }]},
  { name: 'Denizli', lat: 37.77, lng: 29.09, districts: [
    { name: 'Merkezefendi', lat: 37.77, lng: 29.09 }, { name: 'Pamukkale', lat: 37.77, lng: 29.12 },
  ]},
  { name: 'Diyarbakır', lat: 37.91, lng: 40.24, districts: [
    { name: 'Bağlar', lat: 37.9, lng: 40.21 }, { name: 'Kayapınar', lat: 37.93, lng: 40.16 },
    { name: 'Sur', lat: 37.91, lng: 40.24 }, { name: 'Yenişehir', lat: 37.91, lng: 40.22 },
  ]},
  { name: 'Edirne', lat: 41.68, lng: 26.56, districts: [
    { name: 'Merkez', lat: 41.68, lng: 26.56 }, { name: 'Keşan', lat: 40.86, lng: 26.64 },
  ]},
  { name: 'Elazığ', lat: 38.67, lng: 39.22, districts: [{ name: 'Merkez', lat: 38.67, lng: 39.22 }]},
  { name: 'Erzincan', lat: 39.75, lng: 39.49, districts: [{ name: 'Merkez', lat: 39.75, lng: 39.49 }]},
  { name: 'Erzurum', lat: 39.9, lng: 41.27, districts: [
    { name: 'Yakutiye', lat: 39.9, lng: 41.28 }, { name: 'Palandöken', lat: 39.88, lng: 41.26 },
    { name: 'Aziziye', lat: 39.91, lng: 41.2 },
  ]},
  { name: 'Eskişehir', lat: 39.77, lng: 30.52, districts: [
    { name: 'Odunpazarı', lat: 39.77, lng: 30.52 }, { name: 'Tepebaşı', lat: 39.78, lng: 30.51 },
  ]},
  { name: 'Gaziantep', lat: 37.07, lng: 37.38, districts: [
    { name: 'Şahinbey', lat: 37.05, lng: 37.37 }, { name: 'Şehitkamil', lat: 37.08, lng: 37.38 },
    { name: 'Nizip', lat: 37.01, lng: 37.8 },
  ]},
  { name: 'Giresun', lat: 40.91, lng: 38.39, districts: [{ name: 'Merkez', lat: 40.91, lng: 38.39 }]},
  { name: 'Gümüşhane', lat: 40.46, lng: 39.48, districts: [{ name: 'Merkez', lat: 40.46, lng: 39.48 }]},
  { name: 'Hakkari', lat: 37.58, lng: 43.74, districts: [{ name: 'Merkez', lat: 37.58, lng: 43.74 }]},
  { name: 'Hatay', lat: 36.4, lng: 36.35, districts: [
    { name: 'Antakya', lat: 36.2, lng: 36.16 }, { name: 'İskenderun', lat: 36.58, lng: 36.17 },
    { name: 'Defne', lat: 36.23, lng: 36.17 }, { name: 'Samandağ', lat: 36.08, lng: 35.98 },
  ]},
  { name: 'Isparta', lat: 37.76, lng: 30.55, districts: [{ name: 'Merkez', lat: 37.76, lng: 30.55 }]},
  { name: 'Mersin', lat: 36.8, lng: 34.64, districts: [
    { name: 'Yenişehir', lat: 36.8, lng: 34.62 }, { name: 'Toroslar', lat: 36.85, lng: 34.63 },
    { name: 'Akdeniz', lat: 36.8, lng: 34.6 }, { name: 'Mezitli', lat: 36.77, lng: 34.54 },
    { name: 'Tarsus', lat: 36.92, lng: 34.89 }, { name: 'Silifke', lat: 36.38, lng: 33.93 },
    { name: 'Erdemli', lat: 36.61, lng: 34.31 },
  ]},
  { name: 'İstanbul', lat: 41.01, lng: 28.98, districts: [
    { name: 'Kadıköy', lat: 40.98, lng: 29.03 }, { name: 'Üsküdar', lat: 41.02, lng: 29.02 },
    { name: 'Beşiktaş', lat: 41.04, lng: 29.0 }, { name: 'Şişli', lat: 41.06, lng: 28.99 },
    { name: 'Beyoğlu', lat: 41.03, lng: 28.98 }, { name: 'Fatih', lat: 41.01, lng: 28.94 },
    { name: 'Bakırköy', lat: 40.98, lng: 28.87 }, { name: 'Ataşehir', lat: 40.98, lng: 29.11 },
    { name: 'Maltepe', lat: 40.93, lng: 29.13 }, { name: 'Kartal', lat: 40.89, lng: 29.19 },
    { name: 'Pendik', lat: 40.88, lng: 29.23 }, { name: 'Tuzla', lat: 40.82, lng: 29.3 },
    { name: 'Sarıyer', lat: 41.17, lng: 29.06 }, { name: 'Eyüpsultan', lat: 41.05, lng: 28.93 },
    { name: 'Kağıthane', lat: 41.08, lng: 28.97 }, { name: 'Bayrampaşa', lat: 41.04, lng: 28.91 },
    { name: 'Zeytinburnu', lat: 41.0, lng: 28.9 }, { name: 'Güngören', lat: 41.0, lng: 28.88 },
    { name: 'Bahçelievler', lat: 41.0, lng: 28.86 }, { name: 'Bağcılar', lat: 41.04, lng: 28.86 },
    { name: 'Esenler', lat: 41.04, lng: 28.88 }, { name: 'Başakşehir', lat: 41.09, lng: 28.81 },
    { name: 'Küçükçekmece', lat: 41.0, lng: 28.78 }, { name: 'Avcılar', lat: 40.98, lng: 28.72 },
    { name: 'Esenyurt', lat: 41.03, lng: 28.67 }, { name: 'Beylikdüzü', lat: 41.0, lng: 28.64 },
    { name: 'Büyükçekmece', lat: 41.02, lng: 28.58 }, { name: 'Çatalca', lat: 41.14, lng: 28.46 },
    { name: 'Silivri', lat: 41.07, lng: 28.25 }, { name: 'Sultanbeyli', lat: 40.96, lng: 29.27 },
    { name: 'Ümraniye', lat: 41.02, lng: 29.09 }, { name: 'Çekmeköy', lat: 41.04, lng: 29.18 },
    { name: 'Sancaktepe', lat: 41.0, lng: 29.22 }, { name: 'Beykoz', lat: 41.13, lng: 29.1 },
    { name: 'Arnavutköy', lat: 41.18, lng: 28.74 }, { name: 'Sultangazi', lat: 41.1, lng: 28.87 },
    { name: 'Gaziosmanpaşa', lat: 41.06, lng: 28.91 }, { name: 'Adalar', lat: 40.88, lng: 29.09 },
  ]},
  { name: 'İzmir', lat: 38.42, lng: 27.14, districts: [
    { name: 'Konak', lat: 38.42, lng: 27.14 }, { name: 'Karşıyaka', lat: 38.46, lng: 27.11 },
    { name: 'Bornova', lat: 38.47, lng: 27.22 }, { name: 'Buca', lat: 38.39, lng: 27.18 },
    { name: 'Bayraklı', lat: 38.46, lng: 27.16 }, { name: 'Çiğli', lat: 38.5, lng: 27.06 },
    { name: 'Gaziemir', lat: 38.32, lng: 27.13 }, { name: 'Karabağlar', lat: 38.38, lng: 27.13 },
    { name: 'Menemen', lat: 38.6, lng: 26.96 }, { name: 'Torbalı', lat: 38.16, lng: 27.36 },
    { name: 'Balçova', lat: 38.39, lng: 27.05 }, { name: 'Narlıdere', lat: 38.39, lng: 27.0 },
    { name: 'Güzelbahçe', lat: 38.37, lng: 26.89 }, { name: 'Urla', lat: 38.32, lng: 26.76 },
    { name: 'Çeşme', lat: 38.32, lng: 26.3 }, { name: 'Seferihisar', lat: 38.2, lng: 26.84 },
    { name: 'Ödemiş', lat: 38.23, lng: 27.97 }, { name: 'Bergama', lat: 39.12, lng: 27.18 },
    { name: 'Aliağa', lat: 38.8, lng: 26.97 },
  ]},
  { name: 'Kars', lat: 40.6, lng: 43.1, districts: [{ name: 'Merkez', lat: 40.6, lng: 43.1 }]},
  { name: 'Kastamonu', lat: 41.39, lng: 33.78, districts: [{ name: 'Merkez', lat: 41.39, lng: 33.78 }]},
  { name: 'Kayseri', lat: 38.73, lng: 35.49, districts: [
    { name: 'Kocasinan', lat: 38.74, lng: 35.48 }, { name: 'Melikgazi', lat: 38.72, lng: 35.48 },
    { name: 'Talas', lat: 38.69, lng: 35.55 },
  ]},
  { name: 'Kırklareli', lat: 41.73, lng: 27.23, districts: [{ name: 'Merkez', lat: 41.73, lng: 27.23 }]},
  { name: 'Kırşehir', lat: 39.15, lng: 34.17, districts: [{ name: 'Merkez', lat: 39.15, lng: 34.17 }]},
  { name: 'Kocaeli', lat: 40.77, lng: 29.94, districts: [
    { name: 'İzmit', lat: 40.77, lng: 29.94 }, { name: 'Gebze', lat: 40.8, lng: 29.43 },
    { name: 'Darıca', lat: 40.77, lng: 29.38 }, { name: 'Körfez', lat: 40.72, lng: 29.74 },
    { name: 'Derince', lat: 40.76, lng: 29.83 }, { name: 'Gölcük', lat: 40.72, lng: 29.83 },
    { name: 'Kartepe', lat: 40.74, lng: 30.04 }, { name: 'Başiskele', lat: 40.72, lng: 29.93 },
  ]},
  { name: 'Konya', lat: 37.87, lng: 32.49, districts: [
    { name: 'Selçuklu', lat: 37.89, lng: 32.46 }, { name: 'Meram', lat: 37.83, lng: 32.45 },
    { name: 'Karatay', lat: 37.88, lng: 32.5 },
  ]},
  { name: 'Kütahya', lat: 39.42, lng: 29.98, districts: [{ name: 'Merkez', lat: 39.42, lng: 29.98 }]},
  { name: 'Malatya', lat: 38.35, lng: 38.31, districts: [
    { name: 'Battalgazi', lat: 38.38, lng: 38.38 }, { name: 'Yeşilyurt', lat: 38.3, lng: 38.25 },
  ]},
  { name: 'Manisa', lat: 38.61, lng: 27.43, districts: [
    { name: 'Şehzadeler', lat: 38.61, lng: 27.43 }, { name: 'Yunusemre', lat: 38.59, lng: 27.38 },
    { name: 'Akhisar', lat: 38.92, lng: 27.84 }, { name: 'Turgutlu', lat: 38.5, lng: 27.7 },
  ]},
  { name: 'Kahramanmaraş', lat: 37.59, lng: 36.93, districts: [
    { name: 'Onikişubat', lat: 37.59, lng: 36.93 }, { name: 'Dulkadiroğlu', lat: 37.58, lng: 36.92 },
  ]},
  { name: 'Mardin', lat: 37.31, lng: 40.74, districts: [
    { name: 'Artuklu', lat: 37.31, lng: 40.74 }, { name: 'Kızıltepe', lat: 37.19, lng: 40.59 },
  ]},
  { name: 'Muğla', lat: 37.21, lng: 28.36, districts: [
    { name: 'Menteşe', lat: 37.21, lng: 28.36 }, { name: 'Bodrum', lat: 37.04, lng: 27.43 },
    { name: 'Fethiye', lat: 36.65, lng: 29.12 }, { name: 'Marmaris', lat: 36.85, lng: 28.27 },
    { name: 'Milas', lat: 37.31, lng: 27.78 }, { name: 'Dalaman', lat: 36.77, lng: 28.8 },
    { name: 'Datça', lat: 36.73, lng: 27.69 }, { name: 'Köyceğiz', lat: 36.97, lng: 28.69 },
  ]},
  { name: 'Muş', lat: 38.75, lng: 41.51, districts: [{ name: 'Merkez', lat: 38.75, lng: 41.51 }]},
  { name: 'Nevşehir', lat: 38.62, lng: 34.71, districts: [{ name: 'Merkez', lat: 38.62, lng: 34.71 }]},
  { name: 'Niğde', lat: 37.97, lng: 34.68, districts: [{ name: 'Merkez', lat: 37.97, lng: 34.68 }]},
  { name: 'Ordu', lat: 40.98, lng: 37.88, districts: [
    { name: 'Altınordu', lat: 40.98, lng: 37.88 },
  ]},
  { name: 'Rize', lat: 41.02, lng: 40.52, districts: [{ name: 'Merkez', lat: 41.02, lng: 40.52 }]},
  { name: 'Sakarya', lat: 40.68, lng: 30.4, districts: [
    { name: 'Adapazarı', lat: 40.68, lng: 30.4 }, { name: 'Serdivan', lat: 40.7, lng: 30.36 },
    { name: 'Erenler', lat: 40.69, lng: 30.39 },
  ]},
  { name: 'Samsun', lat: 41.29, lng: 36.33, districts: [
    { name: 'İlkadım', lat: 41.29, lng: 36.33 }, { name: 'Atakum', lat: 41.33, lng: 36.26 },
    { name: 'Canik', lat: 41.27, lng: 36.36 }, { name: 'Tekkeköy', lat: 41.21, lng: 36.47 },
  ]},
  { name: 'Siirt', lat: 37.93, lng: 41.94, districts: [{ name: 'Merkez', lat: 37.93, lng: 41.94 }]},
  { name: 'Sinop', lat: 42.03, lng: 35.15, districts: [{ name: 'Merkez', lat: 42.03, lng: 35.15 }]},
  { name: 'Sivas', lat: 39.75, lng: 37.02, districts: [{ name: 'Merkez', lat: 39.75, lng: 37.02 }]},
  { name: 'Tekirdağ', lat: 41.0, lng: 27.52, districts: [
    { name: 'Süleymanpaşa', lat: 41.0, lng: 27.52 }, { name: 'Çorlu', lat: 41.16, lng: 27.8 },
    { name: 'Çerkezköy', lat: 41.28, lng: 27.99 },
  ]},
  { name: 'Tokat', lat: 40.31, lng: 36.55, districts: [{ name: 'Merkez', lat: 40.31, lng: 36.55 }]},
  { name: 'Trabzon', lat: 41.0, lng: 39.72, districts: [
    { name: 'Ortahisar', lat: 41.0, lng: 39.72 }, { name: 'Akçaabat', lat: 41.02, lng: 39.57 },
    { name: 'Yomra', lat: 40.96, lng: 39.86 },
  ]},
  { name: 'Tunceli', lat: 39.11, lng: 39.55, districts: [{ name: 'Merkez', lat: 39.11, lng: 39.55 }]},
  { name: 'Şanlıurfa', lat: 37.16, lng: 38.79, districts: [
    { name: 'Eyyübiye', lat: 37.15, lng: 38.77 }, { name: 'Haliliye', lat: 37.17, lng: 38.8 },
    { name: 'Karaköprü', lat: 37.2, lng: 38.79 }, { name: 'Viranşehir', lat: 37.24, lng: 39.76 },
    { name: 'Siverek', lat: 37.76, lng: 39.32 },
  ]},
  { name: 'Uşak', lat: 38.67, lng: 29.41, districts: [{ name: 'Merkez', lat: 38.67, lng: 29.41 }]},
  { name: 'Van', lat: 38.49, lng: 43.38, districts: [
    { name: 'İpekyolu', lat: 38.49, lng: 43.38 }, { name: 'Tuşba', lat: 38.52, lng: 43.42 },
    { name: 'Edremit', lat: 38.46, lng: 43.3 },
  ]},
  { name: 'Yozgat', lat: 39.82, lng: 34.81, districts: [{ name: 'Merkez', lat: 39.82, lng: 34.81 }]},
  { name: 'Zonguldak', lat: 41.45, lng: 31.79, districts: [
    { name: 'Merkez', lat: 41.45, lng: 31.79 }, { name: 'Ereğli', lat: 41.28, lng: 31.42 },
  ]},
  { name: 'Aksaray', lat: 38.37, lng: 34.03, districts: [{ name: 'Merkez', lat: 38.37, lng: 34.03 }]},
  { name: 'Bayburt', lat: 40.26, lng: 40.23, districts: [{ name: 'Merkez', lat: 40.26, lng: 40.23 }]},
  { name: 'Karaman', lat: 37.18, lng: 33.23, districts: [{ name: 'Merkez', lat: 37.18, lng: 33.23 }]},
  { name: 'Kırıkkale', lat: 39.85, lng: 33.51, districts: [{ name: 'Merkez', lat: 39.85, lng: 33.51 }]},
  { name: 'Batman', lat: 37.88, lng: 41.13, districts: [{ name: 'Merkez', lat: 37.88, lng: 41.13 }]},
  { name: 'Şırnak', lat: 37.42, lng: 42.46, districts: [
    { name: 'Merkez', lat: 37.42, lng: 42.46 }, { name: 'Cizre', lat: 37.33, lng: 42.19 },
  ]},
  { name: 'Bartın', lat: 41.64, lng: 32.34, districts: [{ name: 'Merkez', lat: 41.64, lng: 32.34 }]},
  { name: 'Ardahan', lat: 41.11, lng: 42.7, districts: [{ name: 'Merkez', lat: 41.11, lng: 42.7 }]},
  { name: 'Iğdır', lat: 39.92, lng: 44.05, districts: [{ name: 'Merkez', lat: 39.92, lng: 44.05 }]},
  { name: 'Yalova', lat: 40.66, lng: 29.27, districts: [{ name: 'Merkez', lat: 40.66, lng: 29.27 }]},
  { name: 'Karabük', lat: 41.2, lng: 32.62, districts: [
    { name: 'Merkez', lat: 41.2, lng: 32.62 }, { name: 'Safranbolu', lat: 41.25, lng: 32.69 },
  ]},
  { name: 'Kilis', lat: 36.72, lng: 37.12, districts: [{ name: 'Merkez', lat: 36.72, lng: 37.12 }]},
  { name: 'Osmaniye', lat: 37.07, lng: 36.25, districts: [{ name: 'Merkez', lat: 37.07, lng: 36.25 }]},
  { name: 'Düzce', lat: 40.84, lng: 31.16, districts: [{ name: 'Merkez', lat: 40.84, lng: 31.16 }]},
]

// Alphabetik sırala
provinces.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
