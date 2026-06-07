import { redirect } from 'next/navigation'

// NOT (2026-06-07): Bu rota eskiden sahte "Coşkun Dönge" mock verisi + demo-images
// görselleriyle çalışan, kaydetmeyen (handleSave yalnızca console.log) ikinci bir
// profil düzenleyiciydi ve uygulamada hiçbir yerden bağlı DEĞİLDİ. Ayrıca form;
// profiles tablosunda karşılığı OLMAYAN alanlar (firstName/lastName, ilgi alanları,
// beceriler, kapak fotoğrafı) içerdiği için kullanıcı doldurup kaydetse bile sessizce
// kaybolurdu. Gerçek profil düzenleme /ayarlar sayfasında yapılıyor (updateProfile ile
// kalıcı) ve profil sayfasındaki "Profili Düzenle" düğmesi de oraya gidiyor.
// Tekilleştirmek ve sahte/yarım çalışan ikinci editörü kaldırmak için buraya gelen
// herkesi /ayarlar'a yönlendiriyoruz. Bkz. TECH_DEBT #12.
export default function ProfileEditRedirect() {
  redirect('/ayarlar')
}
