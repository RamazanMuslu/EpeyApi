"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAndGetId = searchAndGetId;
exports.fetchHtml = fetchHtml;
exports.scrapeInfo = scrapeInfo;
exports.scrapeImages = scrapeImages;
exports.scrapeSearch = scrapeSearch;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
const helper_1 = require("../helper");
const turkishToEnglishKeyMap = {
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
function translateTurkishKey(turkishKey) {
    return turkishToEnglishKeyMap[turkishKey] || turkishKey;
}
const turkishToEnglishCategoryMap = {
    "TEMEL BİLGİLER": "Basic Information",
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
    "TEMEL DONANIM": "Basic Hardware",
    "AĞ BAĞLANTILARI": "Network Connections",
    "İŞLETİM SİSTEMİ": "Operating System",
    "KABLOSUZ BAĞLANTILAR": "Wireless Connections",
    "ÇOKLU ORTAM": "Multimedia",
    "ÖZELLİKLER": "Features",
    "DİĞER BAĞLANTILAR": "Other Connections",
    "AB ÜRÜN KAYIT ve ENERJİ ETİKETİ": "EU Product Registration and Energy Label"
};
function translateTurkishCategory(turkishCategory) {
    return turkishToEnglishCategoryMap[turkishCategory] || turkishCategory;
}
const browserHeaders = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Priority": "u=1",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0"
};
async function searchAndGetId(query) {
    try {
        const cwd = process.cwd();
        let pythonExecutable = "python3";
        const venvPythonPath = path_1.default.join(cwd, "venv", "bin", "python");
        if (fs_1.default.existsSync(venvPythonPath)) {
            pythonExecutable = venvPythonPath;
        }
        const scriptPath = path_1.default.join(cwd, "search.py");
        const output = (0, child_process_1.execSync)(`${pythonExecutable} "${scriptPath}" "${query}"`, {
            encoding: "utf-8"
        }).trim();
        if (output && output !== "BULUNAMADI") {
            return output;
        }
        return null;
    }
    catch (error) {
        console.error("Python search bridge error:", error);
        return null;
    }
}
async function fetchHtml(id) {
    const cleanId = (0, helper_1.formatId)(id);
    const cwd = process.cwd();
    // 1. Check local epey-examples directory
    const localCandidates = [
        path_1.default.join(cwd, "epey-examples", cleanId),
        path_1.default.join(cwd, "epey-examples", cleanId.endsWith(".html") ? cleanId : `${cleanId}.html`),
        path_1.default.join(cwd, "..", "epey-examples", cleanId),
        path_1.default.join(cwd, "..", "epey-examples", cleanId.endsWith(".html") ? cleanId : `${cleanId}.html`)
    ];
    for (const candidate of localCandidates) {
        if (fs_1.default.existsSync(candidate)) {
            return fs_1.default.readFileSync(candidate, "utf-8");
        }
    }
    // 2. Fetch from live Epey.com
    const targetUrl = cleanId.includes("/")
        ? `${config_1.EPEY_URL}/${cleanId}`
        : `${config_1.EPEY_URL}/akilli-telefonlar/${cleanId}`;
    const response = await axios_1.default.get(targetUrl, { headers: browserHeaders });
    return response.data;
}
async function scrapeInfo(id) {
    try {
        const html = await fetchHtml(id);
        const $ = cheerio.load(html);
        // Title
        const name = $("h1").first().text().trim();
        // Canonical URL
        const canonical = $("link[rel='canonical']").attr("href");
        const url = canonical || `${config_1.EPEY_URL}/akilli-telefonlar/${(0, helper_1.formatId)(id)}`;
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
        const offers = [];
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
        const specs = {};
        const bilgiler = $("#bilgiler");
        if (bilgiler.length) {
            bilgiler.find("div#grup, div.grup, .grup").each((_i, grupEl) => {
                const head = $(grupEl).find(".baslik, h2, h3, h4").first();
                const turkishCategory = head.length ? head.text().trim() : "GENEL";
                const category = translateTurkishCategory(turkishCategory);
                const catSpecs = {};
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
            id: (0, helper_1.formatId)(id),
            epeyId,
            name,
            url,
            cover,
            userRating,
            offers,
            specs
        };
    }
    catch (error) {
        console.error("scrapeInfo error:", error);
        return null;
    }
}
async function scrapeImages(id) {
    try {
        const html = await fetchHtml(id);
        const $ = cheerio.load(html);
        const images = [];
        const ogImg = $("meta[property='og:image']").attr("content");
        if (ogImg) {
            images.push(ogImg);
        }
        $("#resim img, .resim img, a[href*='resim.epey.com'] img, img[src*='resim.epey.com']").each((_i, el) => {
            const src = $(el).attr("src") || $(el).attr("data-src");
            if (src && src.includes("resim.epey.com")) {
                // Sadece ürün görsellerini al; logo, profil, grup ikonlarını atla
                if (src.includes("/tema/") ||
                    src.includes("/site/") ||
                    src.includes("/grup/") ||
                    src.includes("profil") ||
                    src.includes("logo"))
                    return;
                const highResSrc = src.replace(/\/s_/, "/z_").replace(/\/m_/, "/z_");
                if (!images.includes(highResSrc)) {
                    images.push(highResSrc);
                }
            }
        });
        return images;
    }
    catch (error) {
        console.error("scrapeImages error:", error);
        return [];
    }
}
async function scrapeSearch(query) {
    try {
        const list = [];
        // 1. Try direct Epey live search page scraping for multi-item list
        try {
            const searchUrl = `${config_1.EPEY_URL}/ara/?kat=1&ara=${query}`;
            const searchResponse = await axios_1.default.get(searchUrl, { headers: browserHeaders });
            const $ = cheerio.load(searchResponse.data);
            $("div.listele li, div.listele tr, div.listele div.row, div.listele .detay, .urun_adi").each((_i, el) => {
                const linkEl = $(el).find("a[href*='.html']").first();
                const imgEl = $(el).find("img[src*='resim.epey.com']").first();
                if (linkEl.length) {
                    const href = linkEl.attr("href") || "";
                    // Skip anchor links (#fiyatlar vb.) ve navigasyon linkleri
                    if (href.includes("#") || href.includes("/uye/") || href.includes("/kat/") || href.includes("/ara/"))
                        return;
                    let rawName = linkEl.text().replace(/\s+/g, " ").trim();
                    // Fiyat satırlarını atla (rakam + TL ile başlayanlar)
                    if (/^[\d.,]+ TL/.test(rawName) || rawName.length < 3)
                        return;
                    rawName = rawName.replace(/^(Telefon|Tablet|Saat|Akıllı Saat)\s+/i, "");
                    const id = (0, helper_1.formatId)(href);
                    const image = imgEl.length ? (imgEl.attr("src") || imgEl.attr("data-src") || "") : "";
                    const fullUrl = href.startsWith("http") ? href : `${config_1.EPEY_URL}/${href.replace(/^\//, "")}`;
                    if (!list.some((item) => item.id === id)) {
                        list.push({
                            id,
                            name: rawName,
                            image,
                            url: fullUrl
                        });
                    }
                }
            });
        }
        catch (searchError) {
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
    }
    catch (error) {
        console.error("scrapeSearch error:", error);
        return [];
    }
}
//# sourceMappingURL=epey-parser.js.map