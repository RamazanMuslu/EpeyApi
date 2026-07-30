<h1 align="center">
Epey Smartphone Info API
</h1>

<p align="center">
  Unofficial Epey.com Smartphone Data API providing detailed technical specifications, seller prices, ratings, and gallery images.
</p>

---

## 🚀 Features

- **Search Endpoint**: Search smartphones on Epey.com using DuckDuckGo search bridge or local samples.
- **Detailed Specifications**: Comprehensive technical specs categorized into SCREEN, BATTERY, CAMERA, BASIC HARDWARE, etc.
- **Seller Offers & Pricing**: Real-time store options, seller titles, prices, and shipping information.
- **High-Res Image Gallery**: Access product gallery images in maximum resolution.
- **Offline / Sample Fallback**: Integrated support for testing against `epey-examples` local HTML files.

---

## 🛠️ Installation & Setup

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Set up Python Virtual Environment (for Search Bridge)

```bash
python3 -m venv venv
./venv/bin/pip install ddgs
```

### 3. Environment Variables

Create or edit `.env` in the root directory:

```env
PORT=8080
EPEY_URL=https://www.epey.com
EPEY_TYPE=akilli-telefonlar
```

### 4. Run Server

Development mode with hot reload:

```bash
npm start
```

Build & run production:

```bash
npm run build
node dist/index.js
```

---

## 📡 API Endpoints

### 1. Search Phone

**GET** `/epey/search?q={query}`

```json
[
  {
    "id": "apple-iphone-16-pro-1tb.html",
    "name": "Apple iPhone 16 Pro (1 TB)",
    "image": "https://resim.epey.com/960860/z_apple-iphone-16-pro-1tb-2.jpg",
    "url": "https://www.epey.com/akilli-telefonlar/apple-iphone-16-pro-1tb.html",
    "api": "http://localhost:8080/epey/info/apple-iphone-16-pro-1tb.html"
  }
]
```

---

### 2. Phone Specifications

**GET** `/epey/info/:id`

**Example**: `/epey/info/apple-iphone-16-pro-1tb.html`

```json
{
  "id": "apple-iphone-16-pro-1tb.html",
  "epeyId": "960860",
  "name": "Apple iPhone 16 Pro (1 TB)",
  "url": "https://www.epey.com/akilli-telefonlar/apple-iphone-16-pro-1tb.html",
  "cover": "https://resim.epey.com/960860/z_apple-iphone-16-pro-1tb-2.jpg",
  "userRating": "4.3 (3 vote) / 15 comment",
  "specs": {
    "Screen": {
      "screenSize": "6.3 İnç",
      "screenTechnology": "OLED",
      "screenResolution": "1206x2622 (FHD+) Piksel",
      "screenResolutionStandard": "FHD+",
      "pixelDensity": "460 PPI",
      "refreshRate": "120 Hz",
      "aspectRatio": "19.5:9",
      "screenArea": "96.31 cm²",
      "screenFeatures": "Low-Temperature Polycrystalline Oxide (LTPO) Dolby Vision HDR Çizilmeye Dirençli Cam HDR10 Multi Touch DCI-P3 Renk Uzayı Oleophobic Coating Çerçevesiz Tasarım Sürekli Açık Ekran (Always-on Display) Ekran İçinde Ön Kamera HLG Super Retina XDR Display True Tone Ekran 2.000.000:1 Kontrast Oranı (Tipik) 1000 cd/m² (nit) Parlaklık 1600 cd/m² (nit) Parlaklık (HDR) 2000 cd/m² (nit) Parlaklık (Maks.)",
      "screenDurability": "Corning Ceramic Shield Glass (Gen2)",
      "colorCount": "16 Milyon",
      "screenToBodyRatio": "90.04 %"
    },
    "General": {
      "releaseYear": "2024",
      "announcementDate": "2024, Eylül",
      "series": "Apple iPhone 16",
      "subSeries": "Apple iPhone 16 Pro"
    },
    "Battery": {
      "batteryCapacity": "3582 mAh",
      "videoPlayback": "22 Saat",
      "videoPlaybackNote": "Çevrimiçi",
      "musicPlayback": "85 Saat",
      "chargingPort": "USB Type-C",
      "batteryTechnology": "Lithium Ion (Li-Ion)",
      "fastCharging": "Var",
      "fastChargingPower": "25 W",
      "fastChargingFeatures": "Hızlı Şarj (25W)",
      "wirelessCharging": "Var",
      "wirelessChargingFeatures": "Kablosuz Hızlı Şarj Kablosuz Hızlı Şarj (15W) MagSafe ile Kablosuz Hızlı Şarj (25W)",
      "removableBattery": "Yok"
    },
  },
  ...
}
```

---

### 3. Search & Get Phone Specs (Hybrid)

**GET** `/epey/searchInfo?q={query}`

**Example**: `/epey/searchInfo?q=iPhone+16+Pro`

Returns full phone specifications object for the top search result.

---

### 4. Phone Gallery Images

**GET** `/epey/images/:id`

**Example**: `/epey/images/apple-iphone-16-pro-1tb.html`

```json
{
  "id": "apple-iphone-16-pro-1tb.html",
  "images": [
    "https://resim.epey.com/960860/z_apple-iphone-16-pro-1tb-2.jpg",
    "https://resim.epey.com/960860/z_apple-iphone-16-pro-1tb-3.jpg",
    "https://resim.epey.com/960860/z_apple-iphone-16-pro-1tb-4.jpg"
  ]
}
```
