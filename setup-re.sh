#!/bin/bash

# ====================================================================================
#      MASAL ANLATICI - OTOMATİK KURULUM BETİĞİ (v2.4 - ReSpeaker 2-Mic Hat)
# ====================================================================================
#
# HEDEF SİSTEM:
#   - Donanım: Raspberry Pi Zero 2W
#   - Ses Kartı: Seeed ReSpeaker 2-Mic Pi HAT
#   - İşletim Sistemi: DietPi (Tavsiye Edilen)
#
# GÖREVLER:
#   1. Sistem paketlerini günceller ve temel araçları (git, curl, nginx, sqlite3) kurar.
#   2. ReSpeaker 2-Mic Hat sürücülerini otomatik olarak kurar.
#   3. Web arayüzü için en güncel Node.js (LTS) ve npm'i kurar.
#   4. React projesini, betiğin çalıştığı klasörde kurar ve derler.
#   5. Nginx web sunucusunu React uygulamasını yayınlayacak şekilde yapılandırır.
#   6. Nginx servisini etkinleştirir, böylece RPi her açıldığında web arayüzü otomatik olarak başlar.
#
# ====================================================================================

# Hata durumunda betiği anında sonlandır
set -e

# --- DEĞİŞKENLER ---
# GÜNCELLEME: Proje dizini artık betiğin çalıştığı yer olarak dinamik bir şekilde belirleniyor.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NEEDS_REBOOT=true

# --- BAŞLANGIÇ ---
echo "🚀 Masal Anlatıcı Kurulumu Başlatılıyor..."
echo "Bu betik, DietPi üzerinde Raspberry Pi Zero 2W ve ReSpeaker 2-Mic Hat için optimize edilmiştir."
echo "Proje dizini: ${SCRIPT_DIR}"
echo "------------------------------------------------------------------"

# Kök kullanıcı olarak çalıştırıldığından emin ol
if [ "$(id -u)" -ne 0 ]; then
  echo "❌ HATA: Bu betik root yetkileriyle çalıştırılmalıdır." >&2
  echo "Lütfen 'sudo ./setup-re.sh' komutunu kullanın." >&2
  exit 1
fi


# ====================================================================================
# ADIM 1: SİSTEM PAKETLERİ VE TEMEL ARAÇLARIN KURULUMU
# ====================================================================================
echo "⚙️ ADIM 1: Sistem güncelleniyor ve temel paketler kuruluyor..."
apt-get update
# ReSpeaker sürücüsünün ihtiyaç duyduğu dtparam/dtoverlay komutları için 'libraspberrypi-bin' paketi kuruluyor.
apt-get install -y git curl build-essential nginx sqlite3 rsync raspberrypi-kernel-headers dkms libraspberrypi-bin

echo "✅ Temel paketler başarıyla kuruldu."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 2: SES DONANIMINI YAPILANDIRMA (ReSpeaker 2-Mic Hat)
# ====================================================================================
echo "🔊 ADIM 2: Ses donanımı yapılandırılıyor: ReSpeaker 2-Mic Hat"

if [ -d "/home/seeed-voicecard" ]; then
    echo "✅ ReSpeaker sürücü dizini zaten mevcut. Kurulum atlanıyor."
else
    echo "📝 ReSpeaker sürücüleri GitHub'dan indiriliyor ve kuruluyor..."
    cd /home
    git clone https://github.com/respeaker/seeed-voicecard.git
    cd seeed-voicecard
    ./install.sh
    echo "✅ ReSpeaker sürücü kurulumu tamamlandı. Değişikliklerin etkinleşmesi için yeniden başlatma gerekecek."
fi

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

# Proje dizinine git
cd "${SCRIPT_DIR}"

# GÜNCELLEME: .env dosyası kontrolü artık kurulumu durdurmuyor.
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "⚠️  .env dosyası bulunamadı. .env.example dosyasından boş bir .env kopyalanıyor."
        cp .env.example .env
        echo "✅ Boş .env dosyası oluşturuldu. API anahtarlarını daha sonra web arayüzünden girebilirsiniz."
    else
        echo "⚠️  .env.example dosyası da bulunamadı. Boş bir .env dosyası oluşturuluyor."
        touch .env
    fi
else
    echo "✅ .env dosyası bulundu."
fi

echo "npm bağımlılıkları kuruluyor... (Bu işlem biraz zaman alabilir)"
npm install

echo "React uygulaması derleniyor (npm run build)..."
npm run build

echo "✅ React uygulaması başarıyla derlendi ve ${SCRIPT_DIR}/dist dizininde hazır."
echo "------------------------------------------------------------------"


# ====================================================================================
# ADIM 5: NGINX WEB SUNUCUSUNUN YAPILANDIRILMASI
# ====================================================================================
echo "🚀 ADIM 5: Nginx web sunucusu React uygulamasını yayınlamak için yapılandırılıyor..."

NGINX_CONF="/etc/nginx/sites-available/masal-anlatici"

# GÜNCELLEME: Nginx root dizini dinamik olarak ayarlanıyor.
echo "server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root ${SCRIPT_DIR}/dist;
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
  echo "⚠️  ÖNEMLİ: Ses kartı sürücülerinin etkinleşmesi için sistemin yeniden başlatılması gerekiyor."
  echo "ReSpeaker sürücü kurulumu genellikle kendi yeniden başlatma isteğini sunar."
  read -p "Yine de sistemi şimdi yeniden başlatmak ister misiniz? (e/h): " choice
  case "$choice" in
    e|E ) echo "Sistem yeniden başlatılıyor..."; reboot;;
    * ) echo "Lütfen ayarların geçerli olması için sistemi daha sonra manuel olarak yeniden başlatın ('sudo reboot').";;
  esac
else
  echo "Her şey hazır! Masal Anlatıcınızın keyfini çıkarın."
fi

exit 0
