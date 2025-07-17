#!/bin/bash

# ====================================================================================
#            MASAL ANLATICI - TAM OTOMATİK KURULUM BETİĞİ (v2.2 - DietPi)
# ====================================================================================
#
# HEDEF SİSTEM:
#   - Donanım: Raspberry Pi Zero 2W
#   - Ses Kartı: IQaudio Codec Zero (Siyah PCB)
#   - İşletim Sistemi: DietPi (Tavsiye Edilen)
#
# GÖREVLER:
#   1. Sistem paketlerini günceller ve temel araçları (git, curl, nginx, sqlite3) kurar.
#   2. IQaudio Codec Zero ses kartını otomatik olarak yapılandırır.
#   3. Web arayüzü için en güncel Node.js (LTS) ve npm'i kurar.
#   4. .env.example dosyasından .env dosyasını oluşturur (eğer yoksa).
#   5. React projesini production (üretim) modunda derler.
#   6. Nginx web sunucusunu React uygulamasını yayınlayacak şekilde yapılandırır.
#   7. Nginx servisini etkinleştirir, böylece RPi her açıldığında web arayüzü otomatik olarak başlar.
#
# ====================================================================================

# Hata durumunda betiği anında sonlandır
set -e

# --- DEĞİŞKENLER ---
APP_DIR="/opt/masal-anlatici"
NEEDS_REBOOT=false

# --- BAŞLANGIÇ ---
echo "🚀 Masal Anlatıcı Kurulumu Başlatılıyor..."
echo "Bu betik, DietPi üzerinde Raspberry Pi Zero 2W ve IQaudio Codec Zero için optimize edilmiştir."
echo "------------------------------------------------------------------"

# Kök kullanıcı olarak çalıştırıldığından emin ol
if [ "$(id -u)" -ne 0 ]; then
  echo "❌ HATA: Bu betik root yetkileriyle çalıştırılmalıdır." >&2
  echo "Lütfen 'sudo ./setup.sh' komutunu kullanın." >&2
  exit 1
fi


# ====================================================================================
# ADIM 1: SİSTEM PAKETLERİ VE TEMEL ARAÇLARIN KURULUMU
# ====================================================================================
echo "⚙️ ADIM 1: Sistem güncelleniyor ve temel paketler kuruluyor..."
apt-get update
apt-get install -y git curl build-essential nginx sqlite3 rsync

echo "✅ Temel paketler başarıyla kuruldu."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 2: SES DONANIMINI YAPILANDIRMA (IQaudio Codec Zero)
# ====================================================================================
echo "🔊 ADIM 2: Ses donanımı yapılandırılıyor: IQaudio Codec Zero"
CONFIG_FILE="/boot/config.txt"
CODEC_OVERLAY="dtoverlay=iqaudio-codec"

if grep -q "^${CODEC_OVERLAY}" "${CONFIG_FILE}"; then
  echo "✅ IQaudio Codec Zero zaten yapılandırılmış."
else
  echo "📝 IQaudio Codec Zero ayarı ${CONFIG_FILE} dosyasına ekleniyor..."
  echo "" >> "${CONFIG_FILE}"
  echo "# Masal Anlatıcı projesi tarafından eklendi: IQaudio Codec Zero için" >> "${CONFIG_FILE}"
  echo "${CODEC_OVERLAY}" >> "${CONFIG_FILE}"
  echo "✅ Ayar başarıyla eklendi. Değişikliklerin etkinleşmesi için yeniden başlatma gerekecek."
  NEEDS_REBOOT=true
fi

sed -i -e 's/defaults.ctl.card 1/defaults.ctl.card 0/' -e 's/defaults.pcm.card 1/defaults.pcm.card 0/' /usr/share/alsa/alsa.conf || echo "ALSA yapılandırması atlandı."
echo "✅ Ses donanımı yapılandırması tamamlandı."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 3: NODE.JS VE REACT ORTAMININ KURULUMU
# ====================================================================================
echo "🌐 ADIM 3: Node.js (LTS) ve React ortamı kuruluyor..."

if ! command -v node > /dev/null; then
    echo "Node.js bulunamadı, NodeSource üzerinden kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js zaten kurulu. Sürüm: $(node -v)"
fi

echo "✅ Node.js ve npm ortamı hazır."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 4: REACT UYGULAMASININ KURULUMU VE DERLENMESİ
# ====================================================================================
echo "⚛️  ADIM 4: React uygulaması kuruluyor ve derleniyor..."

# Proje dosyalarının kopyalanacağı dizini oluştur
mkdir -p "${APP_DIR}"

# Mevcut dizindeki tüm proje dosyalarını (bu betik hariç) uygulama dizinine kopyala
echo "Proje dosyaları ${APP_DIR} dizinine kopyalanıyor..."
rsync -a --exclude 'setup.sh' "./" "${APP_DIR}/"

# Uygulama dizinine geç
cd "${APP_DIR}"

# .env dosyasını kontrol et ve oluştur
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "⚠️  .env dosyası bulunamadı. .env.example dosyasından kopyalanıyor."
        cp .env.example .env
        echo "🛑 LÜTFEN DİKKAT: Kurulum durduruldu. Lütfen ${APP_DIR}/.env dosyasını kendi API anahtarlarınızla güncelleyin ve kurulumu yeniden başlatın."
        exit 1
    else
        echo "❌ HATA: .env veya .env.example dosyası bulunamadı. Kuruluma devam edilemiyor."
        exit 1
    fi
fi

echo "✅ .env dosyası bulundu. Kuruluma devam ediliyor."

# React bağımlılıklarını (node_modules) kur
echo "npm bağımlılıkları kuruluyor... (Bu işlem biraz zaman alabilir)"
npm install

# React uygulamasını production (üretim) için derle.
echo "React uygulaması derleniyor (npm run build)..."
npm run build

echo "✅ React uygulaması başarıyla derlendi ve ${APP_DIR}/dist dizininde hazır."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 5: NGINX WEB SUNUCUSUNUN YAPILANDIRILMASI
# ====================================================================================
echo "🚀 ADIM 5: Nginx web sunucusu React uygulamasını yayınlamak için yapılandırılıyor..."

NGINX_CONF="/etc/nginx/sites-available/masal-anlatici"

echo "server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root ${APP_DIR}/dist;
    index index.html;

    server_name _;

    location / {
        try_files \$uri /index.html;
    }
}" > "${NGINX_CONF}"

if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

if [ ! -L /etc/nginx/sites-enabled/masal-anlatici ]; then
    ln -s "${NGINX_CONF}" "/etc/nginx/sites-enabled/masal-anlatici"
fi

echo "✅ Nginx yapılandırması oluşturuldu."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 6: SERVİSİN ETKİNLEŞTİRİLMESİ VE BAŞLATILMASI
# ====================================================================================
echo "⚡ ADIM 6: Nginx servisi etkinleştiriliyor ve başlatılıyor..."

nginx -t
systemctl restart nginx
systemctl enable nginx

echo "✅ Nginx servisi etkinleştirildi ve başlatıldı. Web arayüzü artık aktif!"
echo "------------------------------------------------------------------"


# ====================================================================================
#                              KURULUM TAMAMLANDI
# ====================================================================================
echo "🎉 Kurulum başarıyla tamamlandı!"
echo ""
echo "Web arayüzüne şu adresten erişebilirsiniz:"
echo "http://$(hostname -I | cut -d' ' -f1)"
echo ""

if [ "${NEEDS_REBOOT}" = true ]; then
  echo "⚠️  ÖNEMLİ: Ses kartı ayarlarının etkinleşmesi için sistemin yeniden başlatılması gerekiyor."
  read -p "Sistemi şimdi yeniden başlatmak ister misiniz? (e/h): " choice
  case "$choice" in
    e|E ) echo "Sistem yeniden başlatılıyor..."; reboot;;
    * ) echo "Lütfen ayarların geçerli olması için sistemi daha sonra manuel olarak yeniden başlatın ('sudo reboot').";;
  esac
else
  echo "Her şey hazır! Masal Anlatıcınızın keyfini çıkarın."
fi

exit 0
