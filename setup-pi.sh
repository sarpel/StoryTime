#!/bin/bash

# StoryTime Raspberry Pi Zero 2W Setup Script
# This script sets up the StoryTime application on Raspberry Pi Zero 2W

set -e

echo "🚀 StoryTime Raspberry Pi Zero 2W Kurulum Başlatılıyor..."

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    echo "⚠️  Bu script Raspberry Pi üzerinde çalıştırılmalıdır."
    exit 1
fi

# Update system
echo "📦 Sistem güncelleniyor..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Node.js 18.x kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install required system packages
echo "📦 Sistem paketleri kuruluyor..."
sudo apt-get install -y sqlite3 build-essential python3

# Check Node.js installation
echo "✅ Node.js versiyonu: $(node --version)"
echo "✅ npm versiyonu: $(npm --version)"

# Install project dependencies
echo "📦 Proje bağımlılıkları kuruluyor..."
npm install

# Create necessary directories
echo "📁 Gerekli dizinler oluşturuluyor..."
mkdir -p audio
mkdir -p logs

# Set proper permissions
echo "🔐 İzinler ayarlanıyor..."
chmod +x server.js
chmod 755 audio
chmod 755 logs

# Create systemd service for auto-start
echo "🔧 Sistem servisi oluşturuluyor..."
sudo tee /etc/systemd/system/storytime.service > /dev/null <<EOF
[Unit]
Description=StoryTime Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "🚀 Servis etkinleştiriliyor..."
sudo systemctl daemon-reload
sudo systemctl enable storytime
sudo systemctl start storytime

# Create startup script
echo "📝 Başlangıç betiği oluşturuluyor..."
tee start-storytime.sh > /dev/null <<EOF
#!/bin/bash
cd $(pwd)
npm run start
EOF

chmod +x start-storytime.sh

# Create health check script
echo "🔍 Sağlık kontrol betiği oluşturuluyor..."
tee health-check.sh > /dev/null <<EOF
#!/bin/bash
# Health check for StoryTime application
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ StoryTime çalışıyor"
    exit 0
else
    echo "❌ StoryTime çalışmıyor"
    exit 1
fi
EOF

chmod +x health-check.sh

# Create backup script
echo "💾 Yedekleme betiği oluşturuluyor..."
tee backup.sh > /dev/null <<EOF
#!/bin/bash
# Backup script for StoryTime data
BACKUP_DIR="./backups"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR

# Backup database
if [ -f "storytime.db" ]; then
    cp storytime.db "\$BACKUP_DIR/storytime_\$DATE.db"
    echo "✅ Veritabanı yedeklendi: \$BACKUP_DIR/storytime_\$DATE.db"
fi

# Backup audio files
if [ -d "audio" ]; then
    tar -czf "\$BACKUP_DIR/audio_\$DATE.tar.gz" audio/
    echo "✅ Ses dosyaları yedeklendi: \$BACKUP_DIR/audio_\$DATE.tar.gz"
fi

echo "✅ Yedekleme tamamlandı"
EOF

chmod +x backup.sh

# Display system information
echo ""
echo "🎉 StoryTime kurulumu tamamlandı!"
echo ""
echo "📊 Sistem Bilgileri:"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"
echo "   - Çalışma dizini: $(pwd)"
echo "   - Port: 3001"
echo ""
echo "🚀 Uygulamayı başlatmak için:"
echo "   - Otomatik başlatma: sudo systemctl start storytime"
echo "   - Manuel başlatma: ./start-storytime.sh"
echo "   - Durumu kontrol: sudo systemctl status storytime"
echo ""
echo "🌐 Web arayüzüne erişim:"
echo "   - Yerel: http://localhost:3001"
echo "   - Ağ: http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo "🔧 Yönetim komutları:"
echo "   - Servis durumu: sudo systemctl status storytime"
echo "   - Servis yeniden başlat: sudo systemctl restart storytime"
echo "   - Servis durdur: sudo systemctl stop storytime"
echo "   - Logları görüntüle: sudo journalctl -u storytime -f"
echo "   - Sağlık kontrolü: ./health-check.sh"
echo "   - Yedekleme: ./backup.sh"
echo ""
echo "⚠️  Önemli Notlar:"
echo "   - API anahtarları varsayılan olarak ayarlanmıştır"
echo "   - Kendi API anahtarlarınızı kullanmak için ayarlar panelinden güncelleyin"
echo "   - Ses dosyaları ./audio dizininde saklanır"
echo "   - Veritabanı storytime.db dosyasında saklanır"
echo ""
echo "✅ Kurulum tamamlandı! Uygulamayı başlatmak için yukarıdaki komutları kullanın." 