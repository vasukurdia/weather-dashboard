# 🌤️ SkyLens — Weather Dashboard

A responsive weather dashboard built with **ReactJS** and the **Open-Meteo API**. It automatically detects the user's location via browser GPS and displays real-time weather, air quality, and historical climate data with interactive charts.

---

## 🚀 Live Demo

> _Add your hosted link here (e.g. Vercel / Netlify)_

---

## 📸 Screenshots

> _Add screenshots here after running the project_

---

## ✨ Features

### Page 1 — Current Weather & Hourly Forecast
- 📍 **Auto GPS Detection** — detects location on page load (fallback: New Delhi)
- 📅 **Date Picker** — view weather for any past date
- 🌡️ **Temperature Toggle** — switch between °C and °F (updates all charts live)
- **Individual Weather Variables:**
  - Temperature: Current, Minimum, Maximum
  - Precipitation, Relative Humidity, UV Index
  - Sunrise & Sunset times (IST)
  - Max Wind Speed, Precipitation Probability Max
  - Air Quality: AQI (EU), PM10, PM2.5, CO, NO₂, SO₂
  - CO₂ — _Not available via Open-Meteo API (noted in UI)_
- **6 Hourly Charts** (with Zoom, Pan, Scroll, Download):
  - Temperature (°C / °F)
  - Relative Humidity
  - Precipitation
  - Visibility
  - Wind Speed (10m)
  - PM10 & PM2.5 (combined)

### Page 2 — Historical Analysis (Max 2 Years)
- 📆 **Date Range Picker** — select any range up to 2 years
- **Historical Charts** (with Zoom, Pan, Scroll):
  - Temperature: Mean, Max, Min
  - Sun Cycle: Sunrise & Sunset (IST)
  - Precipitation: Daily totals
  - Wind: Max Speed + Dominant Direction
  - Air Quality: PM10 & PM2.5 daily averages
- 📊 Summary stats: Days analyzed, Avg Temp, Total Precip, Avg Wind, Avg PM10/PM2.5

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **ReactJS** | Frontend framework |
| **ApexCharts** (`react-apexcharts`) | Interactive charts with zoom/pan/scroll |
| **Open-Meteo API** | Weather & forecast data (free, no API key) |
| **Open-Meteo Air Quality API** | PM10, PM2.5, CO, NO₂, SO₂ data |
| **Open-Meteo Archive API** | Historical weather data |
| **Nominatim (OpenStreetMap)** | Reverse geocoding (lat/lon → city name) |
| **Browser Geolocation API** | Auto GPS detection |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard

# 2. Install dependencies
npm install

# 3. Install ApexCharts
npm install react-apexcharts apexcharts

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
weather-dashboard/
├── public/
├── src/
│   ├── App.jsx        # Main application (all components)
│   └── main.jsx       # React entry point
├── index.html
├── package.json
└── README.md
```

---

## 🌐 API Reference

| API | Endpoint | Usage |
|---|---|---|
| Weather Forecast | `api.open-meteo.com/v1/forecast` | Current & hourly weather |
| Air Quality | `air-quality-api.open-meteo.com/v1/air-quality` | PM10, PM2.5, CO, NO₂, SO₂ |
| Historical Archive | `archive-api.open-meteo.com/v1/archive` | Past weather data |
| Nominatim | `nominatim.openstreetmap.org/reverse` | City name from coordinates |

> ✅ No API key required. Open-Meteo is completely free and open source.

---

## ⚠️ Known Limitations

| Limitation | Reason |
|---|---|
| **CO₂ data not available** | Open-Meteo API does not provide CO₂ readings |
| **Historical AQ limited to ~3 months** | `air-quality-api` provides limited past data |
| **Current temp shows "–" for past dates** | `current_weather` field only works for today |

---

## 📊 Chart Interactions

All charts support:
- 🔍 **Zoom** — scroll wheel or pinch on mobile
- 🖱️ **Pan** — click and drag after zooming
- 🔄 **Reset** — double click or toolbar reset button
- 💾 **Download** — save chart as PNG via toolbar
- 📌 **Tooltip** — hover for exact values

---

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy to **Vercel**, **Netlify**, or any static hosting.

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 👨‍💻 Author

- **Name:** _Vasu Kurdia_
- **Email:** _vasukurdia@gmail.com_
- **GitHub:** _https://github.com/vasukurdia_

---