@echo off
echo 🚀 StoryTime Windows Kurulum Başlatılıyor...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı. Lütfen Node.js 18+ kurun.
    echo https://nodejs.org/en/download/
    pause
    exit /b 1
)

echo ✅ Node.js versiyonu: 
node --version
echo ✅ npm versiyonu:
npm --version

REM Install dependencies
echo 📦 Proje bağımlılıkları kuruluyor...
npm install

REM Create necessary directories
echo 📁 Gerekli dizinler oluşturuluyor...
if not exist "audio" mkdir audio
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

REM Create startup script
echo 📝 Başlangıç betiği oluşturuluyor...
echo @echo off > start-storytime.bat
echo cd /d "%~dp0" >> start-storytime.bat
echo npm run start >> start-storytime.bat

REM Create health check script
echo 🔍 Sağlık kontrol betiği oluşturuluyor...
echo @echo off > health-check.bat
echo curl -f http://localhost:3001/api/health ^>nul 2^>^&1 >> health-check.bat
echo if %%errorlevel%% equ 0 ( >> health-check.bat
echo     echo ✅ StoryTime çalışıyor >> health-check.bat
echo ) else ( >> health-check.bat
echo     echo ❌ StoryTime çalışmıyor >> health-check.bat
echo ) >> health-check.bat

REM Create backup script
echo 💾 Yedekleme betiği oluşturuluyor...
echo @echo off > backup.bat
echo set BACKUP_DIR=backups >> backup.bat
echo set DATE=%%date:~-4,4%%%%date:~-10,2%%%%date:~-7,2%%_%%time:~0,2%%%%time:~3,2%%%%time:~6,2%% >> backup.bat
echo set DATE=%%DATE: =0%% >> backup.bat
echo if not exist "%%BACKUP_DIR%%" mkdir "%%BACKUP_DIR%%" >> backup.bat
echo if exist "storytime.db" ( >> backup.bat
echo     copy "storytime.db" "%%BACKUP_DIR%%\storytime_%%DATE%%.db" >> backup.bat
echo     echo ✅ Veritabanı yedeklendi: %%BACKUP_DIR%%\storytime_%%DATE%%.db >> backup.bat
echo ) >> backup.bat
echo if exist "audio" ( >> backup.bat
echo     powershell -command "Compress-Archive -Path 'audio' -DestinationPath '%%BACKUP_DIR%%\audio_%%DATE%%.zip' -Force" >> backup.bat
echo     echo ✅ Ses dosyaları yedeklendi: %%BACKUP_DIR%%\audio_%%DATE%%.zip >> backup.bat
echo ) >> backup.bat
echo echo ✅ Yedekleme tamamlandı >> backup.bat

echo.
echo 🎉 StoryTime kurulumu tamamlandı!
echo.
echo 📊 Sistem Bilgileri:
echo    - Node.js: 
node --version
echo    - npm: 
npm --version
echo    - Çalışma dizini: %CD%
echo    - Port: 3001
echo.
echo 🚀 Uygulamayı başlatmak için:
echo    - Geliştirme modu: npm run dev
echo    - Üretim modu: npm run start
echo    - Manuel başlatma: start-storytime.bat
echo.
echo 🌐 Web arayüzüne erişim:
echo    - Yerel: http://localhost:3001
echo.
echo 🔧 Yönetim komutları:
echo    - Sağlık kontrolü: health-check.bat
echo    - Yedekleme: backup.bat
echo.
echo ⚠️  Önemli Notlar:
echo    - API anahtarları varsayılan olarak ayarlanmıştır
echo    - Kendi API anahtarlarınızı kullanmak için ayarlar panelinden güncelleyin
echo    - Ses dosyaları audio dizininde saklanır
echo    - Veritabanı storytime.db dosyasında saklanır
echo.
echo ✅ Kurulum tamamlandı! Uygulamayı başlatmak için yukarıdaki komutları kullanın.
pause 