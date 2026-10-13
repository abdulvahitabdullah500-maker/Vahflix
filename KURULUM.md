# Vahflix — kurulabilir dosya (APK) nasıl elde edilir?

**Önemli:** Bu pakette hazır bir APK yoktur. APK, Android derleyicisinin (Android SDK + Java) çalıştığı bir ortamda üretilir. Bu yüzden pakette o üretimi senin yerine yapan otomatik kurulum dosyaları var.

Telefonunda **çalışan bir Vahflix** olması için üç yol var. A en hızlısı, B bilgisayar gerektirmez ve sonunda elinde gerçek bir APK dosyası olur.

---

## Yol A — En hızlısı: Expo Go (APK gerekmez, 5 dakika)

Kurulabilir dosya değil ama uygulamanın kendisini telefonunda açar. Bir bilgisayara ihtiyaç var.

1. Telefona **Expo Go** uygulamasını kur (Play Store / App Store).
2. Bilgisayarda bu proje klasöründe terminali aç.
3. `npm install` yaz ve çalıştır.
4. `npx expo start` yaz ve çalıştır.
5. Ekranda çıkan QR kodu Expo Go ile tara. Vahflix telefonunda açılır.

---

## Yol B — Bilgisayar gerekmez: GitHub ile APK üretme

Bu yöntemde APK, GitHub'ın sunucularında otomatik derlenir ve sen dosyayı indirirsin. Bilgisayar şart değil; tarayıcı yeterlidir.

1. [github.com](https://github.com) üzerinden ücretsiz hesap aç.
2. **New repository** ile boş bir depo oluştur (örnek ad: `vahflix`). Private seçebilirsin.
3. Depo sayfasında **Add file → Upload files** de ve bu projedeki **tüm dosyaları** yükle. Gizli `.github` klasörünü de yüklemeyi unutma; yükleyici klasör yapısını korur. Ardından **Commit changes**.
4. Depo üst menüsünden **Actions** sekmesine gir. Solda **Vahflix APK olustur** iş akışını seç.
5. **Run workflow** düğmesine bas. Derleme yaklaşık 5–10 dakika sürer.
6. Yeşil tik çıkınca çalışmanın sayfasına gir ve en alttaki **Artifacts** bölümünden **Vahflix-APK** dosyasını indir. İçinden `app-debug.apk` çıkar.
7. Telefonda bu APK'yı aç. Android "bilinmeyen kaynaklara izin ver" uyarısı verirse onayla ve kurulumu tamamla. Vahflix artık ana ekranında bir uygulama olarak durur.

---

## Yol C — Kendi bilgisayarında APK derleme

Bilgisayarında Node.js, Java 17 ve Android SDK (Android Studio) kurulu olmalıdır.

```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

APK şu adreste oluşur: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Yol D — EAS Build (Expo'nun bulut derlemesi)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

`preview` profili `eas.json` içinde APK üretecek şekilde ayarlandı. Derleme bitince indirme bağlantısı verilir.

---

## iPhone notu

iOS için kurulabilir dosya (IPA) yalnızca Apple imzalama sertifikası ve App Store / TestFlight dağıtımıyla oluşturulur; ücretsiz bir dosya olarak paylaşılamaz. iPhone kullanıyorsan Yol A (Expo Go) senin için en pratik yöntemdir.

---

## APK telefona kurulunca ne olur?

- Vahflix ana ekranda bir mobil uygulama olarak görünür.
- İçerik YouTube bağlantılarından eklenir ve video, uygulamanın içindeki oynatıcıda oynar; videolar indirilmez.
- Liste ve kayıtlar şu an uygulama kapanınca sıfırlanır; kalıcı kayıt için ek geliştirme gerekir.

## Derleme sorun çıkarsa

- `prebuild` hatası: `npm install` komutunun hatasız bittiğinden emin ol.
- Gradle hatası: Java 17 kullan (Java 21 veya 11 değil).
- İndirilen dosya açılmıyor: ZIP'i açıp içindeki `app-debug.apk` dosyasını telefona kopyala; ZIP'in kendisi kurulmaz.
