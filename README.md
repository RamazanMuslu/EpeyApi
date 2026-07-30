<h1 align="center">
Epey Smartphone Info API
</h1>

<p align="center">
  Unofficial Epey.com Smartphone Data API providing detailed technical specifications, seller prices, ratings, and gallery images.
</p>

---

## 🚀 Features

- **Search Endpoint**: Search smartphones on Epey.com using DuckDuckGo search bridge or local samples.
- **Detailed Specifications**: Comprehensive technical specs categorized into EKRAN, BATARYA, KAMERA, TEMEL DONANIM, etc.
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
PORT=39556
EPEY_URL=https://www.epey.com
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
    "url": "https://www.epey.com/akilli-telefonlar/apple-iphone-16-pro-1tb.html"
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
  "userRating": "4.3 (3 oy) / 15 yorum",
  "offers": [
    {
      "seller": "hızlasat",
      "title": "İkinci El Apple Iphone 16 Pro 1Tb...",
      "price": "89.331,10 TL",
      "priceNumeric": 89331.1,
      "shipping": "Ücretsiz Kargo",
      "link": "https://www.epey.com/git/..."
    }
  ],
  "specs": {
    "EKRAN": {
      "Ekran Boyutu": "6.3 İnç",
      "Ekran Teknolojisi": "OLED",
      "Ekran Çözünürlüğü": "1206x2622 (FHD+) Piksel",
      "Ekran Yenileme Hızı": "120 Hz"
    },
    "BATARYA": {
      "Batarya Kapasitesi (Tipik)": "3582 mAh",
      "Hızlı Şarj": "Var",
      "Kablosuz Şarj": "Var"
    },
    "TEMEL DONANIM": {
      "Yonga Seti (Chipset)": "Apple A18 Pro",
      "Bellek (RAM)": "8 GB",
      "Dahili Depolama": "1 TB"
    }
  }
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
