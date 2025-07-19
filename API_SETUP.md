# API Anahtarı Kurulum Rehberi

## 🔐 Güvenlik Güncellemesi

Gemini API'sinin güvenlik nedeniyle frontend'den doğrudan kullanılamayacağı tespit edildi. Bu sorunu çözmek için backend proxy sistemi kuruldu.

## 📋 Kurulum Adımları

### 1. API Anahtarlarını Edinme

#### Gemini API Anahtarı
1. [Google AI Studio](https://aistudio.google.com/) adresine gidin
2. Giriş yapın ve "Get API key" butonuna tıklayın
3. Yeni bir API anahtarı oluşturun
4. Anahtarı kopyalayın

#### ElevenLabs API Anahtarı
1. [ElevenLabs](https://elevenlabs.io/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. Profile > API Key bölümünden anahtarınızı alın

### 2. .env Dosyasını Yapılandırma

Proje ana dizinindeki `.env` dosyasını açın ve API anahtarlarınızı ekleyin:

```env
# Gemini API Configuration
GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXX"

# ElevenLabs API Configuration  
ELEVENLABS_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Server Configuration
PORT=3001
```

### 3. Bağımlılıkları Yükleme

```bash
npm install
```

### 4. Uygulamayı Başlatma

```bash
# Geliştirme modu
npm run dev

# Veya production modu
npm run start
```

## 🔒 Güvenlik Notları

- `.env` dosyası `.gitignore`'da olduğu için git'e gönderilmez
- API anahtarları artık sadece backend'de saklanır
- Frontend'den API anahtarlarına erişim yoktur
- Tüm API çağrıları backend proxy üzerinden yapılır

## 🚨 Önemli Uyarılar

1. **API anahtarlarınızı asla paylaşmayın**
2. **`.env` dosyasını git'e göndermeyin**
3. **API anahtarlarınızı düzenli olarak yenileyin**
4. **Kullanım limitlerinizi kontrol edin**

## 🐛 Sorun Giderme

### "API anahtarı eksik" hatası
- `.env` dosyasının doğru konumda olduğunu kontrol edin
- API anahtarlarının doğru formatta olduğunu kontrol edin
- Sunucuyu yeniden başlatın

### "Geçersiz API anahtarı" hatası
- API anahtarınızın doğru olduğunu kontrol edin
- API anahtarınızın aktif olduğunu kontrol edin
- Kullanım limitinizi kontrol edin

### Model ID vs Voice ID Karışıklığı
**ElevenLabs API'sinde iki farklı ID türü vardır:**

1. **Model ID'ler** (3-5 adet):
   - `eleven_multilingual_v2` - Çok dilli model
   - `eleven_monolingual_v1` - Tek dilli model  
   - `eleven_turbo_v2` - Hızlı model

2. **Voice ID'ler** (20+ adet):
   - `9BWtsMINqrJLrRacOk9x` - Aria sesi
   - `21m00Tcm4TlvDq8ikWAM` - Rachel sesi
   - Ve diğerleri...

**Önemli:** Model ID'ler ses kalitesini belirler, Voice ID'ler ise hangi sesin kullanılacağını belirler. İkisi farklı şeylerdir!

### Dropdown Menülerinde Veri Görünmeme
- "Sesleri ve Modelleri Çek" butonuna tıklayın
- API anahtarlarınızın doğru olduğunu kontrol edin
- Console loglarını kontrol edin
- Sayfayı yenileyin

## 📞 Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. API anahtarlarınızı yeniden oluşturun
3. Sunucuyu yeniden başlatın