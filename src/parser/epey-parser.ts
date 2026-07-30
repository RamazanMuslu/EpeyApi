import axios from "axios";
import * as cheerio from "cheerio";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { PhoneInfo, PhoneDetail, Offer } from "../types";
import { EPEY_URL, EPEY_TYPE, PORT } from "../../config";
import { formatId } from "../helper";

const turkishToEnglishKeyMap: Record<string, string> = {
  // Ekran / Screen
  "Ekran Boyutu": "screenSize",
  "Ekran Teknolojisi": "screenTechnology",
  "Ekran Çözünürlüğü": "screenResolution",
  "Ekran Çözünürlüğü Standardı": "screenResolutionStandard",
  "Piksel Yoğunluğu": "pixelDensity",
  "Ekran Yenileme Hızı": "refreshRate",
  "Ekran Oranı (Aspect Ratio)": "aspectRatio",
  "Ekran Alanı": "screenArea",
  "Ekran Özellikleri": "screenFeatures",
  "Ekran Dayanıklılığı": "screenDurability",
  "Renk Sayısı": "colorCount",
  "Ekran / Gövde Oranı": "screenToBodyRatio",
  
  // Batarya / Battery
  "Batarya Kapasitesi (Tipik)": "batteryCapacity",
  "Batarya Özellikleri": "batteryFeatures",
  "Batarya Teknolojisi": "batteryTechnology",
  "Şarj": "chargingPort",
  "Hızlı Şarj": "fastCharging",
  "Hızlı Şarj Gücü (Maks.)": "fastChargingPower",
  "Hızlı Şarj Özellikleri": "fastChargingFeatures",
  "Şarj Süresi (Üretici Verisi)": "chargingTime",
  "Şarj Döngü Sayısı (Üretici)": "chargeCycleCount",
  "Şarj Döngü Sayısı (AB)": "chargeCycleCountEU",
  "Şarj Sonrası Pil Süresi": "postChargeBatteryLife",
  "Kablosuz Şarj": "wirelessCharging",
  "Kablosuz Şarj Özellikleri": "wirelessChargingFeatures",
  "Değişir Batarya": "removableBattery",
  
  // Kamera / Camera
  "Kamera Çözünürlüğü": "cameraResolution",
  "Kamera Özellikleri": "cameraFeatures",
  "Kamera Sensör Boyutu": "cameraSensorSize",
  "İkinci Arka Kamera": "secondRearCamera",
  "İkinci Arka Kamera Çözünürlüğü": "secondRearCameraResolution",
  "İkinci Arka Kamera Diyafram": "secondRearCameraAperture",
  "İkinci Arka Kamera Özellikleri": "secondRearCameraFeatures",
  "Üçüncü Arka Kamera": "thirdRearCamera",
  "Üçüncü Arka Kamera Çözünürlüğü": "thirdRearCameraResolution",
  "Üçüncü Arka Kamera Diyafram": "thirdRearCameraAperture",
  "Üçüncü Arka Kamera Diyafram (Maks)": "thirdRearCameraApertureMax",
  "Üçüncü Arka Kamera Özellikleri": "thirdRearCameraFeatures",
  "Ön Kamera Çözünürlüğü": "frontCameraResolution",
  "Ön Kamera Diyafram Açıklığı": "frontCameraAperture",
  "Ön Kamera FPS Değeri": "frontCameraFPS",
  "Ön Kamera Özellikleri": "frontCameraFeatures",
  "Ön Kamera Sensör Boyutu": "frontCameraSensorSize",
  "Ön Kamera Video Çözünürlüğü": "frontCameraVideoResolution",
  "Diyafram Açıklığı": "aperture",
  "Flaş": "flash",
  "Odak Uzaklığı": "focalLength",
  "OIS Özelliği": "oisFeature",
  "Optik Görüntü Sabitleyici (OIS)": "opticalImageStabilization",
  "Video FPS Değeri": "videoFPS",
  "Video Kayıt Çözünürlüğü": "videoRecordingResolution",
  "Video Kayıt Özellikleri": "videoRecordingFeatures",
  "Video Kayıt Seçenekleri": "videoRecordingOptions",
  "Ağır Çekim Kayıt Seçenekleri": "slowMotionRecordingOptions",
  "Kayıpsız Yakınlaştırma": "losslessZoom",
  "DxOMark Camera (v5)": "dxomarkCameraV5",
  "DxOMark Camera (v6)": "dxomarkCameraV6",
  
  // İşlemci / Processor
  "Yonga Seti (Chipset)": "chipset",
  "Ana İşlemci (CPU)": "mainProcessor",
  "CPU Çekirdeği": "cpuCores",
  "CPU Frekansı": "cpuFrequency",
  "CPU Üretim Teknolojisi": "cpuManufacturingTechnology",
  "İşlemci Mimarisi": "processorArchitecture",
  "Grafik İşlemcisi (GPU)": "graphicsProcessor",
  "GPU Frekansı": "gpuFrequency",
  "1. Yardımcı İşlemci": "firstCoprocessor",
  "2. Yardımcı İşlemci": "secondCoprocessor",
  "AnTuTu Puanı (v10)": "antutuScoreV10",
  "AnTuTu Puanı (v11)": "antutuScoreV11",
  "Geekbench 6 (Multi-core)": "geekbench6MultiCore",
  "Geekbench 6 (Single-core)": "geekbench6SingleCore",
  
  // Bellek / Memory
  "Bellek (RAM)": "ram",
  "RAM Tipi": "ramType",
  "Dahili Depolama": "internalStorage",
  "Dahili Depolama Biçimi": "internalStorageFormat",
  "Hafıza Kartı Desteği": "memoryCardSupport",
  "Diğer Hafıza Seçenekleri": "otherMemoryOptions",
  
  // Ağ / Network
  "SIM": "sim",
  "Hat Sayısı": "simCount",
  "Çift Hat Özelliği": "dualSimFeature",
  "2G": "network2G",
  "3G": "network3G",
  "4G": "network4G",
  "4G İndirme": "network4GDownload",
  "4G Karşıya Yükleme": "network4GUpload",
  "4G Özellikleri": "network4GFeatures",
  "4G Teknolojisi": "network4GTechnology",
  "4.5G Desteği": "network4_5GSupport",
  "5G": "network5G",
  "Wi-Fi Kanalları": "wifiChannels",
  "Wi-Fi Özellikleri": "wifiFeatures",
  "Bluetooth Versiyonu": "bluetoothVersion",
  "Bluetooth Özellikleri": "bluetoothFeatures",
  "USB Versiyonu": "usbVersion",
  "USB Bağlantı Tipi": "usbConnectionType",
  "USB Özellikleri": "usbFeatures",
  "NFC": "nfc",
  "GPS": "gps",
  "Navigasyon Özellikleri": "navigationFeatures",
  "Radyo": "radio",
  
  // Tasarım / Design
  "Boy": "length",
  "En": "width",
  "Kalınlık": "thickness",
  "Ağırlık": "weight",
  "Ağırlık Seçenekleri": "weightOptions",
  "Gövde Malzemesi (Çerçeve)": "bodyMaterialFrame",
  "Gövde Malzemesi (Kapak)": "bodyMaterialBack",
  "Renk Seçenekleri": "colorOptions",
  "Düşme Direnci Sınıfı": "dropResistanceClass",
  "Suya Dayanıklılık": "waterResistance",
  "Suya Dayanıklılık Seviyesi": "waterResistanceLevel",
  "Suya ya da Toza Direnç Sınıfı": "waterDustResistanceClass",
  "Toza Dayanıklılık": "dustResistance",
  "Toza Dayanıklılık Seviyesi": "dustResistanceLevel",
  "Onarılabilirlik Sınıfı": "repairabilityClass",
  
  // Ses / Sound
  "Hoparlör Özellikleri": "speakerFeatures",
  "Ses Çıkışı": "audioOutput",
  "Müzik Oynatma": "musicPlayback",
  "Video Oynatma": "videoPlayback",
  "Video Oynatma Notu": "videoPlaybackNote",
  
  // Sensörler / Sensors
  "Sensörler": "sensors",
  "Parmak izi Okuyucu": "fingerprintScanner",
  "Parmak izi Okuyucu Özellikleri": "fingerprintScannerFeatures",
  "Bildirim Işığı (LED)": "notificationLed",
  "Kızılötesi": "infrared",
  "Yüz Tanıma": "faceRecognition",
  "Görüntülü Konuşma (Uygulama)": "videoCallApp",
  
  // Yazılım / Software
  "İşletim Sistemi": "operatingSystem",
  "İşletim Sistemi Versiyonu": "operatingSystemVersion",
  "Kullanıcı Arayüzü": "userInterface",
  "Lansman Arayüz Versiyonu": "launchInterfaceVersion",
  "Yükseltilebilir Versiyon": "upgradableVersion",
  "Servis ve Uygulamalar": "servicesAndApps",
  
  // Diğer / Other
  "Çıkış Yılı": "releaseYear",
  "Duyurulma Tarihi": "announcementDate",
  "Seri": "series",
  "Alt Seri": "subSeries",
  "Enerji Sınıfı": "energyClass",
  "SAR Değeri 10g (Baş)": "sarValueHead",
  "SAR Değeri 10g (Vücut)": "sarValueBody",
  "Kutu İçeriği": "boxContents"
};

function translateTurkishKey(turkishKey: string): string {
  return turkishToEnglishKeyMap[turkishKey] || turkishKey;
}

const turkishToEnglishCategoryMap: Record<string, string> = {
  "TEMEL BİLGİLER": "BasicInformation",
  "EKRAN": "Screen",
  "BATARYA": "Battery",
  "KAMERA": "Camera",
  "İŞLEMCİ": "Processor",
  "BELLEK": "Memory",
  "AĞ": "Network",
  "TASARIM": "Design",
  "SES": "Sound",
  "SENSÖRLER": "Sensors",
  "YAZILIM": "Software",
  "DİĞER": "Other",
  "TEMEL DONANIM": "BasicHardware",
  "AĞ BAĞLANTILARI": "NetworkConnections",
  "İŞLETİM SİSTEMİ": "OperatingSystem",
  "KABLOSUZ BAĞLANTILAR": "WirelessConnections",
  "ÇOKLU ORTAM": "Multimedia",
  "ÖZELLİKLER": "Features",
  "DİĞER BAĞLANTILAR": "OtherConnections",
  "AB ÜRÜN KAYIT ve ENERJİ ETİKETİ": "EU Product Registration and Energy Label"
};

function translateTurkishCategory(turkishCategory: string): string {
  return turkishToEnglishCategoryMap[turkishCategory] || turkishCategory;
}

const browserHeadersList: Record<string, string>[] = [
  {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-GB;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.2535.92",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "tr,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Linux\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.165 Mobile Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?1",
    "Sec-Ch-Ua-Platform": "\"Android\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "tr,en-US;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"macOS\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 OPR/96.0.4693.80",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Ch-Ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Opera GX\";v=\"96\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  },
  {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "tr,en-US;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Sec-Ch-Ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Linux\"",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Connection": "keep-alive"
  }
];

export async function searchAndGetId(query: string): Promise<string | null> {
  try {
    const cwd = process.cwd();
    let pythonExecutable = "python3";
    
    const venvPythonPath = path.join(cwd, "venv", "bin", "python");
    if (fs.existsSync(venvPythonPath)) {
      pythonExecutable = venvPythonPath;
    }

    const scriptPath = path.join(cwd, "search.py");
    const output = execSync(`${pythonExecutable} "${scriptPath}" "${query}"`, {
      encoding: "utf-8"
    }).trim();

    if (output && output !== "Not Found") {
      return output;
    }

    return null;
  } catch (error) {
    console.error("Python search bridge error:", error);
    return null;
  }
}

export async function fetchHtml(id: string): Promise<string> {
  const cleanId = formatId(id);
  const cwd = process.cwd();
  
  // 1. Check local epey-examples directory
  const localCandidates = [
    path.join(cwd, "epey-examples", cleanId),
    path.join(cwd, "epey-examples", cleanId.endsWith(".html") ? cleanId : `${cleanId}.html`),
    path.join(cwd, "..", "epey-examples", cleanId),
    path.join(cwd, "..", "epey-examples", cleanId.endsWith(".html") ? cleanId : `${cleanId}.html`)
  ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, "utf-8");
    }
  }

  // 2. Fetch from live Epey.com
  const targetUrl = cleanId.includes("/")
    ? `${EPEY_URL}/${cleanId}`
    : `${EPEY_URL}/${EPEY_TYPE}/${cleanId}`;

  const response = await axios.get(targetUrl, { headers: browserHeadersList[Math.floor(Math.random() * browserHeadersList.length)] });
  return response.data;
}

export async function scrapeInfo(id: string): Promise<PhoneDetail | null> {
  try {
    const html = await fetchHtml(id);
    const $ = cheerio.load(html);

    // Title
    const name = $("h1").first().text().trim();

    // Canonical URL
    const canonical = $("link[rel='canonical']").attr("href");
    const url = canonical || `${EPEY_URL}/${EPEY_TYPE}/${formatId(id)}`;

    // Cover Image
    const ogImg = $("meta[property='og:image']").attr("content");
    const cover = ogImg || "";

    // Epey Numeric ID
    let epeyId = "";
    if (cover) {
      const match = cover.match(/resim\.epey\.com\/(\d+)\//);
      if (match) {
        epeyId = match[1];
      }
    }

    // User Rating / Score
    const uyepuani = $("div.uyepuani").first();
    const userRating = uyepuani.length
      ? uyepuani.text().replace(/\s+/g, " ").trim()
      : "";

    // Offers & Sellers
    const offers: Offer[] = [];
    const fiyatlarDiv = $("#fiyatlar, div.fiyatlar").first();
    if (fiyatlarDiv.length) {
      fiyatlarDiv.find("div").each((_i, el) => {
        const classNames = $(el).attr("class") || "";
        if (classNames.includes("fiyat") && classNames !== "fiyatlar") {
          const sellerEl = $(el).find("a, .satici").first();
          const priceEl = $(el).find(".urun_fiyat").first();
          const shippingEl = $(el).find(".kargo").first();
          const linkEl = $(el).find("a[href]").first();

          if (priceEl.length) {
            const rawPrice = priceEl.text().trim();
            const priceClean = rawPrice.replace(/[^\d,\.]/g, "").replace(".", "").replace(",", ".");
            const priceNumeric = parseFloat(priceClean) || null;

            offers.push({
              seller: sellerEl.text().replace(/\s+/g, " ").trim() || "Bilinmiyor",
              title: $(el).text().replace(/\s+/g, " ").trim(),
              price: rawPrice,
              priceNumeric,
              shipping: shippingEl.length ? shippingEl.text().trim() : null,
              link: linkEl.length ? linkEl.attr("href") || null : null
            });
          }
        }
      });
    }

    // Specs Parsing
    const specs: Record<string, Record<string, string>> = {};
    const bilgiler = $("#bilgiler");
    if (bilgiler.length) {
      bilgiler.find("div#grup, div.grup, .grup").each((_i, grupEl) => {
        const head = $(grupEl).find(".baslik, h2, h3, h4").first();
        const turkishCategory = head.length ? head.text().trim() : "General";
        const category = translateTurkishCategory(turkishCategory);

        const catSpecs: Record<string, string> = {};
        $(grupEl).find("ul > li").each((_j, liEl) => {
          const keyEl = $(liEl).find("strong").first();
          const valEl = $(liEl).find("span.cell").first();

          if (keyEl.length && valEl.length) {
            const turkishKey = keyEl.text().trim();
            const val = valEl.text().replace(/\s+/g, " ").trim();
            if (turkishKey) {
              const englishKey = translateTurkishKey(turkishKey);
              catSpecs[englishKey] = val;
            }
          }
        });

        if (Object.keys(catSpecs).length > 0) {
          specs[category] = catSpecs;
        }
      });
    }

    return {
      id: formatId(id),
      epeyId,
      name,
      url,
      cover,
      userRating,
      offers,
      specs
    };
  } catch (error) {
    console.error("scrapeInfo error:", error);
    return null;
  }
}

export async function scrapeImages(id: string): Promise<string[]> {
  try {
    const html = await fetchHtml(id);
    const $ = cheerio.load(html);

    const images: string[] = [];

    const ogImg = $("meta[property='og:image']").attr("content");
    if (ogImg) {
      images.push(ogImg);
    }

    $("#resim img, .resim img, a[href*='resim.epey.com'] img, img[src*='resim.epey.com']").each((_i, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src");
      if (src && src.includes("resim.epey.com")) {
        // Sadece ürün görsellerini al; logo, profil, grup ikonlarını atla
        if (
          src.includes("/tema/") ||
          src.includes("/site/") ||
          src.includes("/grup/") ||
          src.includes("profil") ||
          src.includes("logo")
        ) return;
        const highResSrc = src.replace(/\/s_/, "/z_").replace(/\/m_/, "/z_");
        if (!images.includes(highResSrc)) {
          images.push(highResSrc);
        }
      }
    });

    return images;
  } catch (error) {
    console.error("scrapeImages error:", error);
    return [];
  }
}

export async function scrapeSearch(query: string): Promise<PhoneInfo[]> {
  try {
    const list: PhoneInfo[] = [];

    // 1. Try direct Epey live search page scraping for multi-item list
    try {
      const searchUrl = `${EPEY_URL}/ara/?kat=1&ara=${query}`;
      const searchResponse = await axios.get(searchUrl, { headers: browserHeadersList[Math.floor(Math.random() * browserHeadersList.length)] });
      const $ = cheerio.load(searchResponse.data);

      $("div.listele li, div.listele tr, div.listele div.row, div.listele .detay, .urun_adi").each((_i, el) => {
        const linkEl = $(el).find("a[href*='.html']").first();
        const imgEl = $(el).find("img[src*='resim.epey.com']").first();

        if (linkEl.length) {
          const href = linkEl.attr("href") || "";

          // Skip anchor links (#fiyatlar vb.) ve navigasyon linkleri
          if (href.includes("#") || href.includes("/uye/") || href.includes("/kat/") || href.includes("/ara/")) return;

          let rawName = linkEl.text().replace(/\s+/g, " ").trim();
          // Fiyat satırlarını atla (rakam + TL ile başlayanlar)
          if (/^[\d.,]+ TL/.test(rawName) || rawName.length < 3) return;
          rawName = rawName.replace(/^(Telefon|Tablet|Saat|Akıllı Saat)\s+/i, "");

          const id = formatId(href);
          const image = imgEl.length ? (imgEl.attr("src") || imgEl.attr("data-src") || "") : "";
          const fullUrl = href.startsWith("http") ? href : `${EPEY_URL}/${href.replace(/^\//, "")}`;

          if (!list.some((item) => item.id === id)) {
            list.push({
              id,
              name: rawName,
              image,
              url: fullUrl,
              api: `http://localhost:${PORT}/epey/info/${id}`
            });
          }
        }
      });
    } catch (searchError) {
      console.log("Live Epey search scrape fallback needed:", searchError);
    }

    // 2. Fallback to Python search bridge / local sample if live search list is empty
    if (list.length === 0) {
      const foundId = await searchAndGetId(query);
      if (foundId) {
        const detail = await scrapeInfo(foundId);
        if (detail) {
          list.push({
            id: detail.id,
            name: detail.name,
            image: detail.cover,
            url: detail.url
          });
        }
      }
    }

    return list;
  } catch (error) {
    console.error("scrapeSearch error:", error);
    return [];
  }
}
