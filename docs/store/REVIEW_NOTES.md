# App Review Notes (Apple "App Review Information" + Play "App access" alanına)

## İngilizce metin (kopyala-yapıştır)

```
DEMO ACCOUNT (pre-verified, full access):
Email: test.komsu1@mahallemiz.test
Password: MahalleTest2026!

ABOUT THE VERIFICATION GATE:
Mahallemiz is a Turkish neighborhood community app. For user safety, browsing
is open to all signed-in users, but ALL interactions (posting, commenting,
listings, donations, messaging) require a one-time address verification via
the Turkish government e-Devlet system (official residence certificate).
Since reviewers cannot obtain a Turkish e-Devlet document, the demo account
above is ALREADY VERIFIED — all features are fully accessible with it.

An unverified flow can be observed with this second account (you will see the
verification prompts instead of the interactions):
Email: test.dogrulanmamis@mahallemiz.test
Password: MahalleTest2026!

UGC SAFETY: every post/comment/listing/user can be reported in-app (flag
icon / "Şikâyet Et"); users can be blocked from their profile ("Engelle");
content passes automated moderation + admin review; community guidelines:
https://komsu-app.vercel.app/topluluk-kurallari

PAYMENTS: the only purchasable items are real-world services for local
businesses (business directory membership, classified listing fees) paid via
PayTR (licensed Turkish payment provider). No digital content or in-app
features are sold. Payments are NOT live yet (provider in test mode).

ACCOUNT DELETION: Settings → "Hesabı Sil" (deletes auth, profile, content,
and uploaded files).

Location use: user manually selects their neighborhood; optional GPS assist
only while using the map. No background location.
```

## Notlar (kendimize)
- Demo hesaplar canlı DB'de mevcut ve doğrulanmış (E2E test kullanıcıları).
- Yayın öncesi şifreyi değiştirip bu dosyayı ve mağaza formunu güncellemeyi unutma
  (şifre repo'da/raporlarda geçiyor — mağaza başvurusu sırasında taze şifre üret).
- Apple "Sign-in required" işaretlenecek + yukarıdaki hesap girilecek.
- Play "App access" → "All or some functionality is restricted" → aynı hesabı ekle.
