# **Masal Anlatıcı 🚀**

Bu proje, bir Raspberry Pi Zero 2W üzerinde çalışan, Google Gemini ve ElevenLabs API'lerini kullanarak 5 yaşındaki bir kız çocuğu için kişiselleştirilmiş, erdem odaklı uyku masalları üreten ve seslendiren bir web uygulamasıdır.

## **🎯 Hedef Donanım ve Yazılım**

* **Donanım:** Raspberry Pi Zero 2W  
* **Ses Kartı:** IQaudio Codec Zero (Siyah PCB)  
* **İşletim Sistemi:** DietPi (Hafif ve performanslı olduğu için tavsiye edilir)

## **✨ Özellikler**

* **Modern Arayüz:** React, Vite ve TailwindCSS ile oluşturulmuş, çocuk dostu, koyu temalı, fütüristik ve tamamen Türkçe bir web arayüzü.  
* **Yapay Zeka Destekli Masal Üretimi:**  
  * Google Gemini API'si ile istenen konuda veya seçilen erdem (Dürüstlük, Cesaret vb.) üzerine özgün masallar yaratma.  
  * "Fikir Ver" butonu ile rastgele veya erdem odaklı masal konuları önerme.  
* **Gerçekçi Seslendirme:**  
  * ElevenLabs API'si ile oluşturulan masalları akıcı bir Türkçe ile seslendirme.  
* **Gelişmiş Ayarlar Paneli:**  
  * Gemini ve ElevenLabs için API anahtarlarını ve model ID'lerini girme.  
  * API üzerinden mevcut ses ve modelleri dinamik olarak çekip listeden seçme.  
  * Seslendirme için tonlama (stability) ve benzerlik (similarity) ayarları.  
  * Masal uzunluğunu dakika olarak belirleme.  
* **Kompakt Masal Kütüphanesi:**  
  * Oluşturulan masalları "Aktif" ve "Okunmuş" olarak iki ayrı bölümde listeleme.  
  * Masalları silme veya tekrar aktif etme.  
* **Tam Otomatik Kurulum:** setup.sh betiği ile tüm sistem, donanım ve yazılım kurulumunu tek komutla yapma.

## **📂 Proje Yapısı**

Projenin ana dosyaları ve dizinleri şunlardır:

/  
├── .env.example      \# API anahtarları için şablon  
├── .gitignore        \# Versiyon kontrolünde yoksayılacak dosyalar  
├── setup.sh          \# Ana kurulum betiği  
├── package.json      \# Proje bağımlılıkları  
├── index.html        \# Ana HTML dosyası  
├── src/              \# React uygulama kaynak kodları  
│   ├── main.jsx  
│   ├── App.jsx  
│   └── index.css  
└── ...               \# Diğer proje dosyaları

## **🛠️ Kurulum Adımları**

Kurulum, setup.sh betiği sayesinde oldukça basittir.

**Ön Koşul:** DietPi işletim sisteminin SD karta yazılmış ve Raspberry Pi'nin internete bağlı olması gerekmektedir.

**1\. API Ayar Dosyasını Oluşturun:**

Kuruluma başlamadan önce, projenin API anahtarlarını ve temel ayarlarını içeren .env dosyasını oluşturmanız gerekir. .env.example dosyasını kopyalayarak bu işlemi yapabilirsiniz:

cp .env.example .env

**2\. API Anahtarlarını Girin:**

Oluşturduğunuz .env dosyasını bir metin editörü ile açın (nano .env) ve kendi API anahtarlarınızı ve istediğiniz ayarları girin.

**3\. Kurulum Betiğini Çalıştırın:**

Proje dosyalarının olduğu dizinde aşağıdaki komutu çalıştırın. Betik, geri kalan her şeyi sizin için halledecektir.

sudo ./setup.sh

Betiğin çalışması, internet hızınıza ve Raspberry Pi'nin performansına bağlı olarak biraz zaman alabilir. Kurulum tamamlandığında, eğer ses kartı ayarları için gerekliyse, sistemin yeniden başlatılması istenecektir.

## **🖥️ Kullanım**

Kurulum tamamlandıktan ve Raspberry Pi (yeniden) başladıktan sonra:

1. Aynı ağdaki herhangi bir bilgisayar, telefon veya tabletten bir web tarayıcısı açın.  
2. Adres çubuğuna Raspberry Pi'nizin IP adresini yazın. (Örn: http://192.168.1.50)  
3. Masal Anlatıcı uygulamasının arayüzü karşınıza gelecektir. Keyfini çıkarın\!