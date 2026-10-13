# Vahflix — mobil uygulama

Vahflix; Android ve iOS için hazırlanmış React Native / Expo kaynak projesidir. Tarayıcıda açılan bir web sitesi değildir. Karanlık temalı katalog, arama, Film/Dizi filtreleri, Listem, YouTube bağlantısı ekleme ve uygulama içi oynatıcı arayüzü bulunur.

## Çalıştırma

1. Bilgisayarınıza Node.js LTS kurun.
2. Bu klasörde terminal açıp `npm install` çalıştırın.
3. `npx expo start` komutunu çalıştırın.
4. Android/iOS emülatöründe açın veya Expo Go ile QR kodu tarayın.

Android paketi (APK) oluşturmak için Expo hesabı ve EAS CLI ile `eas build -p android --profile preview` kullanabilirsiniz. iOS cihazına dağıtım için Apple geliştirici hesabı gerekir.

## YouTube oynatımı ve içerik hakları

Uygulama videoları indirmez, kopyalamaz veya YouTube’dan akış çıkarmaya çalışmaz. Video, YouTube’un resmi gömülü oynatıcısı (`youtube-nocookie.com`) içinde oynatılır. Yalnızca izleme ve gömmeye izin verilen videoları ekleyin; bir videonun gömülmesi kapalıysa ya da yaş/bölge kısıtı varsa oynatıcı video sahibinin/YouTube’un kurallarına göre çalışmayabilir. İçeriği eklemeden önce kullanım ve telif izinlerini doğrulayın.

Başlangıç kataloğunda Blender Foundation’ın açık film projesi Big Buck Bunny için örnek YouTube videosu yer alır. Kendi video bağlantılarınızı sağ üstteki `+` düğmesinden ekleyebilirsiniz. Dizi bölümlerini ayrı ayrı ekleyin; Dizi filtresi bunları birlikte listeler.

## Notlar

- Kaynak kod, mağazaya yüklenmiş hazır bir APK değildir; Android/iOS derlemesi alınabilir bir proje temelidir.
- Liste ve kayıtlar şu an uygulama çalıştığı sürece bellekte tutulur; uygulama kapatılıp açıldığında sıfırlanır.
- Gerçek bir yayın platformu için içerik kataloğu, hesaplar ve kalıcı veri saklama ayrıca eklenmelidir.
