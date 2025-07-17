# StoryTime - Uyku Masalları 🚀

StoryTime, 5 yaşındaki Türk kız çocukları için özel olarak tasarlanmış, yapay zeka destekli masal üretim uygulamasıdır. Gemini AI ve ElevenLabs teknolojilerini kullanarak kişiselleştirilmiş masallar oluşturur ve seslendirir.

## 🌟 Özellikler

- **AI Destekli Masal Üretimi**: Gemini 2.5 Flash ile yaratıcı masallar
- **Türkçe Seslendirme**: ElevenLabs ile doğal Türkçe seslendirme
- **Eğitici İçerik**: Dürüstlük, cesaret, paylaşım gibi değerleri öğreten masallar
- **Kişiselleştirilmiş Ayarlar**: Ses kalitesi ve masal süresi ayarları
- **Veritabanı Desteği**: SQLite ile masal ve ayar saklama
- **Raspberry Pi Uyumlu**: Hafif RAM kullanımı ile Pi Zero 2W'de çalışır

## 🛠️ Teknolojiler

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Veritabanı**: SQLite3
- **AI**: Google Gemini API
- **TTS**: ElevenLabs API

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Raspberry Pi Zero 2W (opsiyonel)

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd StoryTime
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. API Anahtarlarını Ayarlayın
Uygulama varsayılan olarak test API anahtarları ile gelir. Kendi anahtarlarınızı kullanmak için:

1. [Google AI Studio](https://aistudio.google.com/)'dan Gemini API anahtarı alın
2. [ElevenLabs](https://elevenlabs.io/)'dan API anahtarı alın
3. Ayarlar panelinden API anahtarlarını güncelleyin

### 4. Uygulamayı Başlatın

#### Geliştirme Modu
```bash
# Terminal 1: Backend sunucusu
npm run server

# Terminal 2: Frontend geliştirme sunucusu
npm run dev
```

#### Üretim Modu
```bash
npm run start
```

Uygulama http://localhost:3001 adresinde çalışacaktır.

## 🔧 API Konfigürasyonu

### Gemini API
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Header**: `x-goog-api-key: YOUR_API_KEY`
- **Model**: `gemini-2.5-flash` (varsayılan)

### ElevenLabs API
- **Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Header**: `xi-api-key: YOUR_API_KEY`
- **Model**: `eleven_multilingual_v2`
- **Voice**: `xsGHrtxT5AdDzYXTQT0d` (Gönül Filiz)

## 📁 Proje Yapısı

```
StoryTime/
├── src/
│   ├── App.jsx          # Ana uygulama bileşeni
│   ├── main.jsx         # React giriş noktası
│   └── index.css        # Stil dosyaları
├── server.js            # Express backend sunucusu
├── package.json         # Proje bağımlılıkları
├── vite.config.js       # Vite konfigürasyonu
├── storytime.db         # SQLite veritabanı (otomatik oluşturulur)
├── audio/               # Ses dosyaları dizini
└── README.md           # Bu dosya
```

## 🗄️ Veritabanı Şeması

### Settings Tablosu
- `api_gemini`: Gemini API anahtarı
- `api_elevenlabs`: ElevenLabs API anahtarı
- `voice_stability`: Ses kararlılığı (0-1)
- `voice_similarity_boost`: Ses benzerlik artışı (0-1)
- `generation_duration`: Masal süresi (dakika)

### Stories Tablosu
- `title`: Masal başlığı
- `content`: Masal içeriği
- `audio_url`: Ses dosyası URL'i
- `audio_file_path`: Yerel ses dosyası yolu
- `read_status`: Okunma durumu

## 🎯 Kullanım

1. **Masal Oluşturma**: Metin kutusuna masal konusu yazın veya önerilen erdemlerden birini seçin
2. **Seslendirme**: Oluşturulan masalı dinlemek için play butonuna tıklayın
3. **Ayarlar**: Sağ üst köşedeki ayarlar butonundan API anahtarlarını ve ses ayarlarını yapılandırın
4. **Yönetim**: Masalları silin, okunma durumunu değiştirin

## 🔒 Güvenlik

- API anahtarları yerel olarak saklanır
- HTTPS kullanımı önerilir
- CORS koruması aktif

## 🐛 Sorun Giderme

### API Hataları
- API anahtarlarının doğru olduğundan emin olun
- İnternet bağlantınızı kontrol edin
- API kotalarını kontrol edin

### Ses Sorunları
- Tarayıcı ses izinlerini kontrol edin
- ElevenLabs API anahtarının geçerli olduğundan emin olun

### Veritabanı Sorunları
- `storytime.db` dosyasının yazma izinlerini kontrol edin
- SQLite3 bağımlılığının yüklü olduğundan emin olun

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Not**: Bu uygulama test ortamında çalışmaktadır. Üretim ortamında kullanmadan önce güvenlik ayarlarını gözden geçirin.