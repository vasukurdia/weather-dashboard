import { useState, useEffect, useCallback, useRef } from "react";
import ReactApexChart from "react-apexcharts";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:wght@600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sky: #e8f4fd;
    --sky2: #cde4f5;
    --blue: #1e6fba;
    --blue-mid: #2979c4;
    --blue-light: #6db3e8;
    --navy: #0f2d4a;
    --gold: #f5a623;
    --rose: #d94f63;
    --green: #1e9e5e;
    --orange: #e07b22;
    --purple: #7c3aad;
    --teal: #0e8a76;
    --bg: #eef5fb;
    --card: #ffffff;
    --border: #cfe0f0;
    --text: #142638;
    --muted: #5a7d99;
    --shadow: 0 2px 14px rgba(30,111,186,0.09);
    --shadow-lg: 0 6px 28px rgba(30,111,186,0.13);
    --radius: 18px;
    --radius-sm: 11px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  h1,h2,h3,.brand { font-family: 'Playfair Display', serif; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── NAV ── */
  .nav {
    background: var(--card);
    border-bottom: 1.5px solid var(--border);
    padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between;
    height: 66px;
    position: sticky; top: 0; z-index: 200;
    box-shadow: 0 2px 16px rgba(30,111,186,0.08);
  }
  .brand { font-size: 1.4rem; color: var(--navy); letter-spacing: -0.01em; }
  .brand span { color: var(--blue-mid); }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 9px 22px; border-radius: 9px; border: none;
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.91rem; font-weight: 500;
    color: var(--muted); transition: all 0.17s;
  }
  .nav-tab:hover { background: var(--sky); color: var(--blue); }
  .nav-tab.active { background: var(--blue-mid); color: #fff; }
  .nav-right { font-size: 0.8rem; color: var(--muted); }

  /* ── MAIN ── */
  .main { flex: 1; padding: 26px 30px; max-width: 1440px; margin: 0 auto; width: 100%; }

  /* ── CARD ── */
  .card {
    background: var(--card); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 20px 22px;
  }
  .card-sm { padding: 15px 17px; border-radius: var(--radius-sm); }

  /* ── GRIDS ── */
  .grid-auto  { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(155px,1fr)); }
  .grid-2     { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
  .grid-3     { display: grid; gap: 14px; grid-template-columns: repeat(3,1fr); }
  .grid-charts{ display: grid; gap: 18px; grid-template-columns: 1fr 1fr; }

  /* ── METRIC ── */
  .metric { display: flex; flex-direction: column; gap: 3px; }
  .metric-icon  { font-size: 1.35rem; margin-bottom: 3px; }
  .metric-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; }
  .metric-val   { font-size: 1.45rem; font-weight: 700; color: var(--text); line-height: 1.1; }
  .metric-unit  { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }
  .metric-na    { font-size: 0.7rem; color: #bbb; font-style: italic; }

  /* ── SECTION TITLE ── */
  .section-title {
    font-size: 1.05rem; font-weight: 600; color: var(--navy);
    margin-bottom: 13px; display: flex; align-items: center; gap: 8px;
  }
  .pill {
    font-size: 0.7rem; background: var(--sky); color: var(--blue-mid);
    padding: 2px 10px; border-radius: 20px;
    font-family: 'DM Sans',sans-serif; font-weight: 500;
  }

  /* ── DATE / CONTROLS ── */
  .date-row { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .label    { font-size: 0.76rem; font-weight: 600; color: var(--muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
  .date-input {
    border: 1.5px solid var(--border); border-radius: 9px; padding: 9px 14px;
    font-family: 'DM Sans',sans-serif; font-size: 0.88rem; color: var(--text);
    background: var(--card); outline: none; cursor: pointer;
    transition: border-color 0.15s;
  }
  .date-input:focus { border-color: var(--blue-mid); }
  .btn {
    padding: 9px 20px; border-radius: 9px; border: none; cursor: pointer;
    font-family: 'DM Sans',sans-serif; font-size: 0.88rem; font-weight: 600;
    transition: all 0.15s; letter-spacing: 0.01em;
  }
  .btn-primary { background: var(--blue-mid); color: #fff; }
  .btn-primary:hover { background: var(--navy); }
  .toggle-wrap { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: 9px; overflow: hidden; }
  .toggle-btn {
    padding: 8px 15px; border: none; cursor: pointer;
    font-family: 'DM Sans',sans-serif; font-size: 0.83rem; font-weight: 600;
    background: var(--card); color: var(--muted); transition: all 0.14s;
  }
  .toggle-btn.on { background: var(--blue-mid); color: #fff; }

  /* ── HERO ── */
  .weather-hero {
    background: linear-gradient(135deg, #0e4d8a 0%, #1e6fba 55%, #2e8fd8 100%);
    border-radius: var(--radius); padding: 30px 34px; color: #fff; margin-bottom: 20px;
    display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px;
    box-shadow: 0 10px 36px rgba(30,111,186,0.28);
    position: relative; overflow: hidden;
  }
  .weather-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 220px; height: 220px; border-radius: 50%;
    background: rgba(255,255,255,0.05); pointer-events: none;
  }
  .hero-city   { font-size: 0.88rem; opacity: 0.8; margin-bottom: 5px; }
  .hero-desc   { font-size: 1.25rem; font-weight: 600; margin-bottom: 4px; }
  .hero-temp   { font-size: 5.5rem; font-weight: 700; line-height: 1; letter-spacing: -3px; }
  .hero-icon   { font-size: 6.5rem; line-height: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2)); }
  .hero-right  { text-align: right; }
  .hero-meta   { display: flex; gap: 20px; margin-top: 16px; flex-wrap: wrap; }
  .hero-meta-item { font-size: 0.82rem; opacity: 0.82; display: flex; align-items: center; gap: 5px; }

  /* ── AQI BADGE ── */
  .aqi-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 13px; border-radius: 20px; font-size: 0.79rem; font-weight: 700;
  }
  .aqi-good      { background: #d1f5e4; color: #0a5e2a; }
  .aqi-moderate  { background: #fef3c7; color: #78450a; }
  .aqi-sensitive { background: #ffe4cc; color: #7a2e00; }
  .aqi-unhealthy { background: #ffd7dc; color: #7a0014; }
  .aqi-hazardous { background: #f3d6f5; color: #5a006b; }

  /* ── SUN BAR ── */
  .sun-row { display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--muted); margin-bottom: 5px; }
  .sun-bar { position: relative; height: 7px; background: var(--sky2); border-radius: 4px; }
  .sun-progress { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--gold), var(--orange)); transition: width 0.6s ease; }
  .sun-pct { font-size: 0.75rem; color: var(--muted); text-align: center; margin-top: 4px; }

  /* ── CHART CARD ── */
  .chart-card {
    background: var(--card); border-radius: var(--radius);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
    padding: 18px 16px 8px; overflow: hidden;
  }
  .chart-title {
    font-size: 0.86rem; font-weight: 600; color: var(--navy);
    margin-bottom: 4px; display: flex; align-items: center; gap: 7px;
  }
  .chart-hint { font-size: 0.7rem; color: var(--muted); margin-bottom: 10px; }

  /* ── LOCATION BAR ── */
  .location-bar {
    background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
    font-size: 0.86rem; box-shadow: var(--shadow);
  }
  .loc-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--green); flex-shrink: 0; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── SPINNER ── */
  .spinner-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 220px; gap: 14px; }
  .spinner { width: 38px; height: 38px; border: 3px solid var(--sky2); border-top-color: var(--blue-mid); border-radius: 50%; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner-text { font-size: 0.85rem; color: var(--muted); }

  /* ── ERROR ── */
  .error-box { background: #fff2f2; border: 1.5px solid #ffb8b8; border-radius: var(--radius-sm); padding: 14px 18px; color: #b91c1c; font-size: 0.88rem; margin-bottom: 16px; }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 70px 20px; color: var(--muted); }
  .empty-icon  { font-size: 3.5rem; margin-bottom: 14px; }
  .empty-title { font-size: 1.1rem; font-weight: 600; color: var(--navy); margin-bottom: 6px; }
  .empty-sub   { font-size: 0.87rem; }

  /* ── HIST SECTION ── */
  .hist-section { margin-bottom: 26px; }

  /* ── WIND DIR GRID ── */
  .wind-dir-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; max-height: 210px; overflow-y: auto; }
  .wind-dir-item { text-align: center; min-width: 46px; }
  .dir-badge {
    width: 32px; height: 32px; line-height: 32px; border-radius: 50%;
    background: var(--sky); font-size: 0.78rem; font-weight: 700; color: var(--blue-mid);
    display: inline-block; margin-bottom: 2px;
  }
  .dir-date { font-size: 0.58rem; color: var(--muted); }

  /* ── DIVIDER ── */
  .divider { height: 1px; background: var(--border); margin: 22px 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .grid-charts { grid-template-columns: 1fr; }
    .grid-3      { grid-template-columns: 1fr 1fr; }
    .main        { padding: 16px; }
    .hero-temp   { font-size: 3.8rem; }
    .hero-icon   { font-size: 4.5rem; }
  }
  @media (max-width: 620px) {
    .grid-auto   { grid-template-columns: repeat(2, 1fr); }
    .grid-2      { grid-template-columns: 1fr; }
    .grid-3      { grid-template-columns: 1fr 1fr; }
    .nav         { padding: 0 14px; }
    .nav-right   { display: none; }
    .main        { padding: 12px; }
    .weather-hero{ padding: 20px; }
    .hero-temp   { font-size: 3rem; }
  }

  /* ApexCharts overrides */
  .apexcharts-toolbar { z-index: 10 !important; }
  .apexcharts-menu    { background: var(--card) !important; border: 1.5px solid var(--border) !important; border-radius: 8px !important; }
`;

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const WMO = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Icy Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy Drizzle", icon: "🌧️" },
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Light Snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  80: { label: "Rain Showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

const AQI_LEVELS = [
  { max: 50, label: "Good", cls: "aqi-good", emoji: "😊" },
  { max: 100, label: "Moderate", cls: "aqi-moderate", emoji: "😐" },
  {
    max: 150,
    label: "Unhealthy (Sensitive)",
    cls: "aqi-sensitive",
    emoji: "😷",
  },
  { max: 200, label: "Unhealthy", cls: "aqi-unhealthy", emoji: "🤢" },
  { max: Infinity, label: "Hazardous", cls: "aqi-hazardous", emoji: "☠️" },
];

const WIND_DIRS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const pad2 = (n) => String(n).padStart(2, "0");
const toDate = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const toF = (c) => +((c * 9) / 5 + 32).toFixed(1);
const degToDir = (deg) => WIND_DIRS[Math.round(deg / 22.5) % 16];

function fmtTime(iso) {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getAQILevel(aqi) {
  return (
    AQI_LEVELS.find((l) => aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1]
  );
}

// PM2.5 → US AQI
function pm25toAQI(pm) {
  if (pm == null) return null;
  if (pm <= 12.0) return Math.round((50 / 12.0) * pm);
  if (pm <= 35.4)
    return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm - 12.1));
  if (pm <= 55.4)
    return Math.round(100 + ((150 - 100) / (55.4 - 35.5)) * (pm - 35.5));
  if (pm <= 150.4)
    return Math.round(150 + ((200 - 150) / (150.4 - 55.5)) * (pm - 55.5));
  return Math.round(200 + ((300 - 200) / (250.4 - 150.5)) * (pm - 150.5));
}

// ─── APEX CHART DEFAULTS ────────────────────────────────────────────────────
function baseOptions({
  categories,
  yLabel = "",
  unit = "",
  colors = ["#1e6fba"],
  type = "line",
  height = 220,
}) {
  return {
    chart: {
      type,
      height,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: { enabled: true, type: "x" },
      animations: { enabled: true, speed: 400 },
      fontFamily: "'DM Sans', sans-serif",
      background: "transparent",
    },
    colors,
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: type === "bar" ? 0 : 2.5 },
    grid: {
      borderColor: "#e2edf5",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "10px", colors: "#5a7d99" },
        rotate: -30,
        rotateAlways: false,
      },
      tickAmount: 10,
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#5a7d99" },
        formatter: (v) => (v != null ? v.toFixed(1) : ""),
      },
      title: { text: yLabel, style: { color: "#5a7d99", fontSize: "11px" } },
    },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: (v) => (v != null ? `${(+v).toFixed(2)} ${unit}` : "N/A"),
      },
      style: { fontSize: "12px" },
    },
    legend: { labels: { colors: "#142638" }, fontSize: "12px" },
    plotOptions: { bar: { borderRadius: 3, columnWidth: "70%" } },
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function apiFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

async function fetchWeather(lat, lon, date) {
  const u = new URL("https://api.open-meteo.com/v1/forecast");
  u.searchParams.set("latitude", lat);
  u.searchParams.set("longitude", lon);
  u.searchParams.set("start_date", date);
  u.searchParams.set("end_date", date);
  u.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum," +
      "windspeed_10m_max,precipitation_probability_max,uv_index_max,weathercode",
  );
  u.searchParams.set(
    "hourly",
    "temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m,weathercode",
  );
  u.searchParams.set("current_weather", "true");
  u.searchParams.set("timezone", "auto");
  return apiFetch(u.toString());
}

async function fetchAQ(lat, lon, date) {
  const u = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  u.searchParams.set("latitude", lat);
  u.searchParams.set("longitude", lon);
  u.searchParams.set("start_date", date);
  u.searchParams.set("end_date", date);
  u.searchParams.set(
    "hourly",
    "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
  );
  u.searchParams.set("timezone", "auto");
  return apiFetch(u.toString());
}

async function fetchHistWeather(lat, lon, s, e) {
  const u = new URL("https://archive-api.open-meteo.com/v1/archive");
  u.searchParams.set("latitude", lat);
  u.searchParams.set("longitude", lon);
  u.searchParams.set("start_date", s);
  u.searchParams.set("end_date", e);
  u.searchParams.set(
    "daily",
    "temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset," +
      "precipitation_sum,windspeed_10m_max,winddirection_10m_dominant",
  );
  u.searchParams.set("timezone", "auto");
  return apiFetch(u.toString());
}

async function fetchHistAQ(lat, lon, s, e) {
  const u = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  u.searchParams.set("latitude", lat);
  u.searchParams.set("longitude", lon);
  u.searchParams.set("start_date", s);
  u.searchParams.set("end_date", e);
  u.searchParams.set("hourly", "pm10,pm2_5");
  u.searchParams.set("timezone", "auto");
  return apiFetch(u.toString());
}

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const d = await r.json();
    return (
      d.address?.city ||
      d.address?.town ||
      d.address?.village ||
      d.address?.county ||
      "Your Location"
    );
  } catch {
    return "Your Location";
  }
}

// ─── CHART CARD ──────────────────────────────────────────────────────────────
function ChartCard({ title, hint, children }) {
  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      {hint && (
        <div className="chart-hint">
          🔍 Pinch / scroll to zoom · Drag to pan · Toolbar for more
        </div>
      )}
      {children}
    </div>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────
function Loader({ text = "Fetching data…" }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <div className="spinner-text">{text}</div>
    </div>
  );
}

// ─── PAGE 1 ──────────────────────────────────────────────────────────────────
function CurrentPage({ location }) {
  const [date, setDate] = useState(toDate(new Date()));
  const [wData, setWData] = useState(null);
  const [aqData, setAqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [city, setCity] = useState("");

  const T = (c) =>
    c == null ? "–" : unit === "C" ? `${Math.round(c)}°C` : `${toF(c)}°F`;
  const Tv = (c) => (c == null ? null : unit === "C" ? +c.toFixed(1) : toF(c));

  const load = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const [w, aq] = await Promise.all([
        fetchWeather(location.lat, location.lon, date),
        fetchAQ(location.lat, location.lon, date),
      ]);
      setWData(w);
      setAqData(aq);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [location, date]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (location) reverseGeocode(location.lat, location.lon).then(setCity);
  }, [location]);

  if (!location) return <Loader text="Detecting your location…" />;

  const d = wData?.daily;
  const cw = wData?.current_weather;
  const h = wData?.hourly;
  const aq = aqData?.hourly;
  // past date ke liye hourly[12] use karo, aaj ke liye current_weather
  const isToday = date === toDate(new Date());
  const middayIdx =
    h?.time?.findIndex((t) => new Date(t).getHours() === 12) ?? 0;
  const displayTemp = isToday
    ? cw?.temperature
    : h?.temperature_2m?.[middayIdx];
  const displayCode = isToday ? cw?.weathercode : h?.weathercode?.[middayIdx];
  const wmo = WMO[displayCode] || { label: "Unknown", icon: "🌡️" };

  // Current-hour index
  const nowH = new Date().getHours();
  const hIdx = h?.time?.findIndex((t) => new Date(t).getHours() === nowH) ?? 0;
  const aqIdx = (aq?.time || []).findIndex(
    (t) => new Date(t).getHours() === nowH,
  );
  const aqi_ = aqIdx >= 0 ? aqIdx : 0;

  const curHum = h?.relativehumidity_2m?.[hIdx];
  const curPrec = h?.precipitation?.[hIdx];
  const curPM10 = aq?.pm10?.[aqi_];
  const curPM25 = aq?.pm2_5?.[aqi_];
  const curCO = aq?.carbon_monoxide?.[aqi_];
  const curNO2 = aq?.nitrogen_dioxide?.[aqi_];
  const curSO2 = aq?.sulphur_dioxide?.[aqi_];
  const euAQI = aq?.european_aqi?.[aqi_];
  const aqiVal = euAQI ?? pm25toAQI(curPM25) ?? 0;
  const aqiLvl = getAQILevel(aqiVal);

  // Sun progress
  const sr = d?.sunrise?.[0] ? new Date(d.sunrise[0]) : null;
  const ss = d?.sunset?.[0] ? new Date(d.sunset[0]) : null;
  const now = new Date();
  let sunPct = 0;
  if (sr && ss) {
    const tot = ss - sr;
    const el = Math.min(Math.max(now - sr, 0), tot);
    sunPct = Math.round((el / tot) * 100);
  }

  // ── Hourly series ──
  const hLabels = (h?.time || []).map((t) => `${new Date(t).getHours()}:00`);
  const aqLabels = (aq?.time || []).map((t) => `${new Date(t).getHours()}:00`);

  // Temp series (respects unit)
  const tempSeries = [
    { name: `Temp °${unit}`, data: (h?.temperature_2m || []).map(Tv) },
  ];
  const humSeries = [
    { name: "Humidity %", data: h?.relativehumidity_2m || [] },
  ];
  const precSeries = [{ name: "Precipitation", data: h?.precipitation || [] }];
  const visSeries = [
    {
      name: "Visibility km",
      data: (h?.visibility || []).map((v) => (v != null ? v / 1000 : null)),
    },
  ];
  const windSeries = [{ name: "Wind km/h", data: h?.windspeed_10m || [] }];
  const pmSeries = [
    { name: "PM10", data: aq?.pm10 || [] },
    { name: "PM2.5", data: aq?.pm2_5 || [] },
  ];

  return (
    <div>
      {/* Location bar */}
      <div className="location-bar">
        <div className="loc-dot" />
        <b style={{ color: "var(--navy)" }}>{city || "Detecting…"}</b>
        <span style={{ color: "var(--muted)" }}>·</span>
        <span style={{ color: "var(--muted)" }}>
          {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
        </span>
      </div>

      {/* Controls */}
      <div className="date-row">
        <div>
          <div className="label">Date</div>
          <input
            type="date"
            className="date-input"
            value={date}
            max={toDate(new Date())}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={load}>
          Fetch Weather
        </button>
        <div>
          <div className="label">Temperature Unit</div>
          <div
            style={{
              display: "flex",
              gap: 0,
              border: "1.5px solid var(--border)",
              borderRadius: 9,
              overflow: "hidden",
              width: "fit-content",
            }}
          >
            <button
              className={`toggle-btn${unit === "C" ? " on" : ""}`}
              onClick={() => setUnit("C")}
            >
              °C
            </button>
            <button
              className={`toggle-btn${unit === "F" ? " on" : ""}`}
              onClick={() => setUnit("F")}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {loading && <Loader />}
      {error && <div className="error-box">⚠️ {error}</div>}

      {!loading && wData && (
        <>
          {/* ── HERO ── */}
          <div className="weather-hero">
            <div>
              <div className="hero-city">
                📍 {city} · {date}
              </div>
              <div className="hero-desc">{wmo.label}</div>
              <div className="hero-temp">{T(displayTemp)}</div>
              <div className="hero-meta">
                <span className="hero-meta-item">
                  🔻 {T(d?.temperature_2m_min?.[0])}
                </span>
                <span className="hero-meta-item">
                  🔺 {T(d?.temperature_2m_max?.[0])}
                </span>
                <span className="hero-meta-item">💧 {curHum ?? "–"}%</span>
                <span className="hero-meta-item">
                  💨 {cw?.windspeed ?? "–"} km/h
                </span>
                <span className="hero-meta-item">
                  🌧️ {d?.precipitation_sum?.[0] ?? 0} mm
                </span>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-icon">{wmo.icon}</div>
              <div style={{ marginTop: 10 }}>
                <div className={`aqi-badge ${aqiLvl.cls}`}>
                  {aqiLvl.emoji} AQI {aqiVal} · {aqiLvl.label}
                </div>
              </div>
            </div>
          </div>

          {/* ── WEATHER METRICS ── */}
          <div className="section-title">
            🌡️ Weather Variables <span className="pill">Individual Values</span>
          </div>
          <div className="grid-auto" style={{ marginBottom: 20 }}>
            {[
              {
                icon: "🌡️",
                label: "Temp (Current)",
                val: T(cw?.temperature),
                unit: "",
              },
              {
                icon: "🔻",
                label: "Temp (Min)",
                val: T(d?.temperature_2m_min?.[0]),
                unit: "",
              },
              {
                icon: "🔺",
                label: "Temp (Max)",
                val: T(d?.temperature_2m_max?.[0]),
                unit: "",
              },
              {
                icon: "🌧️",
                label: "Precipitation",
                val: d?.precipitation_sum?.[0] ?? 0,
                unit: "mm",
              },
              {
                icon: "💧",
                label: "Humidity",
                val: `${curHum ?? "–"}`,
                unit: "%",
              },
              {
                icon: "☀️",
                label: "UV Index Max",
                val: d?.uv_index_max?.[0] ?? 0,
                unit: "index",
              },
              {
                icon: "🌅",
                label: "Sunrise",
                val: fmtTime(d?.sunrise?.[0]),
                unit: "IST",
              },
              {
                icon: "🌇",
                label: "Sunset",
                val: fmtTime(d?.sunset?.[0]),
                unit: "IST",
              },
              {
                icon: "💨",
                label: "Max Wind Speed",
                val: d?.windspeed_10m_max?.[0] ?? 0,
                unit: "km/h",
              },
              {
                icon: "🌂",
                label: "Precip Prob Max",
                val: `${d?.precipitation_probability_max?.[0] ?? 0}`,
                unit: "%",
              },
            ].map((m, i) => (
              <div key={i} className="card card-sm metric">
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-unit">{m.unit}</div>
              </div>
            ))}
          </div>

          {/* ── SUN CYCLE ── */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>
              ☀️ Sun Cycle
            </div>
            <div className="sun-row">
              <span>🌅 {fmtTime(d?.sunrise?.[0])}</span>
              <span style={{ fontWeight: 600 }}>
                {sunPct}% daylight elapsed
              </span>
              <span>🌇 {fmtTime(d?.sunset?.[0])}</span>
            </div>
            <div className="sun-bar">
              <div className="sun-progress" style={{ width: `${sunPct}%` }} />
            </div>
          </div>

          {/* ── AIR QUALITY ── */}
          <div className="section-title">
            🌬️ Air Quality Metrics <span className="pill">Current Hour</span>
          </div>
          <div className="grid-auto" style={{ marginBottom: 24 }}>
            {[
              { icon: "📊", label: "AQI (EU)", val: aqiVal, unit: "index" },
              {
                icon: "🟡",
                label: "PM10",
                val: curPM10 != null ? curPM10.toFixed(1) : "–",
                unit: "μg/m³",
              },
              {
                icon: "🟠",
                label: "PM2.5",
                val: curPM25 != null ? curPM25.toFixed(1) : "–",
                unit: "μg/m³",
              },
              {
                icon: "💨",
                label: "CO",
                val: curCO != null ? curCO.toFixed(0) : "–",
                unit: "μg/m³",
              },
              {
                icon: "🟤",
                label: "NO₂",
                val: curNO2 != null ? curNO2.toFixed(1) : "–",
                unit: "μg/m³",
              },
              {
                icon: "🔴",
                label: "SO₂",
                val: curSO2 != null ? curSO2.toFixed(1) : "–",
                unit: "μg/m³",
              },
              {
                icon: "⚫",
                label: "CO₂",
                val: null,
                unit: "",
                na: "Not available via Open-Meteo API",
              },
            ].map((m, i) => (
              <div key={i} className="card card-sm metric">
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-label">{m.label}</div>
                {m.na ? (
                  <div className="metric-na">{m.na}</div>
                ) : (
                  <>
                    <div className="metric-val">{m.val}</div>
                    <div className="metric-unit">{m.unit}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── HOURLY CHARTS ── */}
          <div className="section-title">
            📈 Hourly Visualizations{" "}
            <span className="pill">{date} · Zoom &amp; Pan enabled</span>
          </div>
          <div className="grid-charts">
            {/* Temperature */}
            <ChartCard title={`🌡️ Temperature (°${unit})`} hint>
              <ReactApexChart
                type="line"
                height={220}
                series={tempSeries}
                options={{
                  ...baseOptions({
                    categories: hLabels,
                    unit: `°${unit}`,
                    colors: ["#d94f63"],
                    height: 220,
                  }),
                  annotations: {
                    xaxis: [
                      {
                        x: `${nowH}:00`,
                        borderColor: "#1e6fba",
                        label: {
                          text: "Now",
                          style: {
                            color: "#fff",
                            background: "#1e6fba",
                            fontSize: "10px",
                          },
                        },
                      },
                    ],
                  },
                }}
              />
            </ChartCard>

            {/* Humidity */}
            <ChartCard title="💧 Relative Humidity (%)" hint>
              <ReactApexChart
                type="area"
                height={220}
                series={humSeries}
                options={{
                  ...baseOptions({
                    categories: hLabels,
                    unit: "%",
                    colors: ["#1e6fba"],
                    height: 220,
                  }),
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.35,
                      opacityTo: 0.05,
                    },
                  },
                  yaxis: { ...baseOptions({}).yaxis, min: 0, max: 100 },
                }}
              />
            </ChartCard>

            {/* Precipitation */}
            <ChartCard title="🌧️ Precipitation (mm)" hint>
              <ReactApexChart
                type="bar"
                height={220}
                series={precSeries}
                options={baseOptions({
                  categories: hLabels,
                  unit: "mm",
                  colors: ["#2e8fd8"],
                  type: "bar",
                  height: 220,
                })}
              />
            </ChartCard>

            {/* Visibility */}
            <ChartCard title="👁️ Visibility (km)" hint>
              <ReactApexChart
                type="line"
                height={220}
                series={visSeries}
                options={baseOptions({
                  categories: hLabels,
                  unit: "km",
                  colors: ["#0e8a76"],
                  height: 220,
                })}
              />
            </ChartCard>

            {/* Wind Speed */}
            <ChartCard title="💨 Wind Speed 10m (km/h)" hint>
              <ReactApexChart
                type="area"
                height={220}
                series={windSeries}
                options={{
                  ...baseOptions({
                    categories: hLabels,
                    unit: "km/h",
                    colors: ["#7c3aad"],
                    height: 220,
                  }),
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0.02,
                    },
                  },
                }}
              />
            </ChartCard>

            {/* PM10 & PM2.5 */}
            <ChartCard title="🌬️ PM10 & PM2.5 (μg/m³)" hint>
              <ReactApexChart
                type="line"
                height={220}
                series={pmSeries}
                options={baseOptions({
                  categories: aqLabels,
                  unit: "μg/m³",
                  colors: ["#e07b22", "#d94f63"],
                  height: 220,
                })}
              />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

// ─── PAGE 2 ──────────────────────────────────────────────────────────────────
function HistoricalPage({ location }) {
  const twoYrsAgo = new Date();
  twoYrsAgo.setFullYear(twoYrsAgo.getFullYear() - 2);

  const [startDate, setStart] = useState(
    toDate(new Date(Date.now() - 30 * 864e5)),
  );
  const [endDate, setEnd] = useState(toDate(new Date()));
  const [wData, setWData] = useState(null);
  const [aqData, setAqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!location) return;
    const diff = (new Date(endDate) - new Date(startDate)) / 864e5;
    if (diff > 730) {
      setError("Date range cannot exceed 2 years (730 days).");
      return;
    }
    if (diff < 1) {
      setError("End date must be after start date.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [w, aq] = await Promise.all([
        fetchHistWeather(location.lat, location.lon, startDate, endDate),
        fetchHistAQ(location.lat, location.lon, startDate, endDate),
      ]);
      setWData(w);
      setAqData(aq);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [location, startDate, endDate]);

  // ── Build daily data ──
  const daily = (wData?.daily?.time || []).map((t, i) => ({
    date: t,
    mean: wData.daily.temperature_2m_mean?.[i],
    max: wData.daily.temperature_2m_max?.[i],
    min: wData.daily.temperature_2m_min?.[i],
    precip: wData.daily.precipitation_sum?.[i],
    windMax: wData.daily.windspeed_10m_max?.[i],
    windDir: wData.daily.winddirection_10m_dominant?.[i],
    sunrise: wData.daily.sunrise?.[i],
    sunset: wData.daily.sunset?.[i],
  }));

  // ── Aggregate hourly AQ → daily avg ──
  const aqMap = {};
  (aqData?.hourly?.time || []).forEach((t, i) => {
    const day = t.slice(0, 10);
    if (!aqMap[day]) aqMap[day] = { pm10: [], pm25: [] };
    if (aqData.hourly.pm10?.[i] != null)
      aqMap[day].pm10.push(aqData.hourly.pm10[i]);
    if (aqData.hourly.pm2_5?.[i] != null)
      aqMap[day].pm25.push(aqData.hourly.pm2_5[i]);
  });
  const aqDaily = daily.map((d) => ({
    date: d.date,
    pm10: aqMap[d.date]?.pm10.length
      ? aqMap[d.date].pm10.reduce((a, b) => a + b, 0) /
        aqMap[d.date].pm10.length
      : null,
    pm25: aqMap[d.date]?.pm25.length
      ? aqMap[d.date].pm25.reduce((a, b) => a + b, 0) /
        aqMap[d.date].pm25.length
      : null,
  }));

  // Sun decimal hours (IST)
  const sunDaily = daily.map((d) => {
    const sr = d.sunrise ? new Date(d.sunrise) : null;
    const ss = d.sunset ? new Date(d.sunset) : null;
    return {
      date: d.date,
      sunrise: sr ? +(sr.getHours() + sr.getMinutes() / 60).toFixed(2) : null,
      sunset: ss ? +(ss.getHours() + ss.getMinutes() / 60).toFixed(2) : null,
    };
  });

  // Thin for performance (max 180 pts)
  const thin = (arr, max = 180) => {
    if (arr.length <= max) return arr;
    const step = Math.ceil(arr.length / max);
    return arr.filter((_, i) => i % step === 0);
  };
  const td = thin(daily);
  const ts = thin(sunDaily);
  const ta = thin(aqDaily);
  const dates = td.map((d) => d.date);
  const sDates = ts.map((d) => d.date);
  const aDates = ta.map((d) => d.date);

  const fmtDecH = (v) => {
    if (v == null) return "";
    const h = Math.floor(v),
      m = Math.round((v - h) * 60);
    return `${pad2(h)}:${pad2(m)}`;
  };

  // Stats
  const avgOf = (arr, fn) => {
    const v = arr.map(fn).filter((x) => x != null);
    return v.length
      ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
      : "–";
  };
  const sumOf = (arr, fn) => {
    const v = arr.map(fn).filter((x) => x != null);
    return v.reduce((a, b) => a + b, 0).toFixed(0);
  };

  return (
    <div>
      {/* Controls */}
      <div className="date-row">
        <div>
          <div className="label">Start Date</div>
          <input
            type="date"
            className="date-input"
            value={startDate}
            min={toDate(twoYrsAgo)}
            max={endDate}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <div className="label">End Date</div>
          <input
            type="date"
            className="date-input"
            value={endDate}
            min={startDate}
            max={toDate(new Date())}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={load}>
          Analyze Range
        </button>
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--muted)",
            alignSelf: "center",
          }}
        >
          Max range: 2 years
        </span>
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}
      {loading && <Loader text="Loading historical data…" />}

      {!loading && wData && (
        <>
          {/* Summary */}
          <div className="grid-auto" style={{ marginBottom: 22 }}>
            {[
              { icon: "📅", label: "Days", val: daily.length, unit: "days" },
              {
                icon: "🌡️",
                label: "Avg Temp",
                val: avgOf(daily, (d) => d.mean),
                unit: "°C",
              },
              {
                icon: "🌧️",
                label: "Total Precip",
                val: sumOf(daily, (d) => d.precip),
                unit: "mm",
              },
              {
                icon: "💨",
                label: "Avg Max Wind",
                val: avgOf(daily, (d) => d.windMax),
                unit: "km/h",
              },
              {
                icon: "🟡",
                label: "Avg PM10",
                val: avgOf(aqDaily, (d) => d.pm10),
                unit: "μg/m³",
              },
              {
                icon: "🟠",
                label: "Avg PM2.5",
                val: avgOf(aqDaily, (d) => d.pm25),
                unit: "μg/m³",
              },
            ].map((m, i) => (
              <div key={i} className="card card-sm metric">
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-val">{m.val}</div>
                <div className="metric-unit">{m.unit}</div>
              </div>
            ))}
          </div>

          {/* Temperature */}
          <div className="hist-section">
            <div className="section-title">🌡️ Temperature Trends</div>
            <ChartCard title="Mean / Max / Min Temperature (°C)" hint>
              <ReactApexChart
                type="line"
                height={240}
                series={[
                  {
                    name: "Mean",
                    data: td.map((d) =>
                      d.mean != null ? +d.mean.toFixed(1) : null,
                    ),
                  },
                  {
                    name: "Max",
                    data: td.map((d) =>
                      d.max != null ? +d.max.toFixed(1) : null,
                    ),
                  },
                  {
                    name: "Min",
                    data: td.map((d) =>
                      d.min != null ? +d.min.toFixed(1) : null,
                    ),
                  },
                ]}
                options={{
                  ...baseOptions({
                    categories: dates,
                    unit: "°C",
                    colors: ["#1e6fba", "#d94f63", "#2e8fd8"],
                    height: 240,
                  }),
                  stroke: { curve: "smooth", width: [2.5, 1.5, 1.5] },
                  fill: { type: ["solid", "solid", "solid"] },
                }}
              />
            </ChartCard>
          </div>

          {/* Sun Cycle */}
          <div className="hist-section">
            <div className="section-title">🌅 Sun Cycle (IST)</div>
            <ChartCard title="Sunrise & Sunset Times (decimal 24h)" hint>
              <ReactApexChart
                type="line"
                height={220}
                series={[
                  { name: "Sunrise", data: ts.map((d) => d.sunrise) },
                  { name: "Sunset", data: ts.map((d) => d.sunset) },
                ]}
                options={{
                  ...baseOptions({
                    categories: sDates,
                    colors: ["#f5a623", "#e07b22"],
                    height: 220,
                  }),
                  yaxis: {
                    min: 4,
                    max: 22,
                    labels: {
                      formatter: fmtDecH,
                      style: { fontSize: "11px", colors: "#5a7d99" },
                    },
                    title: {
                      text: "Time (24h)",
                      style: { color: "#5a7d99", fontSize: "11px" },
                    },
                  },
                  tooltip: {
                    y: { formatter: (v) => fmtDecH(v) + " IST" },
                    theme: "light",
                  },
                }}
              />
            </ChartCard>
          </div>

          {/* Precipitation */}
          <div className="hist-section">
            <div className="section-title">🌧️ Precipitation</div>
            <ChartCard title="Daily Total Precipitation (mm)" hint>
              <ReactApexChart
                type="bar"
                height={220}
                series={[
                  {
                    name: "Precipitation",
                    data: td.map((d) =>
                      d.precip != null ? +d.precip.toFixed(1) : 0,
                    ),
                  },
                ]}
                options={baseOptions({
                  categories: dates,
                  unit: "mm",
                  colors: ["#2e8fd8"],
                  type: "bar",
                  height: 220,
                })}
              />
            </ChartCard>
          </div>

          {/* Wind */}
          <div className="hist-section">
            <div className="section-title">💨 Wind</div>
            <div className="grid-charts">
              <ChartCard title="Max Wind Speed (km/h)" hint>
                <ReactApexChart
                  type="line"
                  height={220}
                  series={[
                    {
                      name: "Max Wind",
                      data: td.map((d) =>
                        d.windMax != null ? +d.windMax.toFixed(1) : null,
                      ),
                    },
                  ]}
                  options={{
                    ...baseOptions({
                      categories: dates,
                      unit: "km/h",
                      colors: ["#7c3aad"],
                      height: 220,
                    }),
                    fill: {
                      type: "gradient",
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.25,
                        opacityTo: 0.02,
                      },
                    },
                  }}
                />
              </ChartCard>
              <ChartCard title="Dominant Wind Direction">
                <div className="wind-dir-grid">
                  {td.map((d, i) => (
                    <div key={i} className="wind-dir-item">
                      <div
                        className="dir-badge"
                        title={`${d.date}: ${d.windDir}°`}
                      >
                        {d.windDir != null ? degToDir(d.windDir) : "–"}
                      </div>
                      <div className="dir-date">{d.date?.slice(5)}</div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                    marginTop: 6,
                  }}
                >
                  Scroll to see all · {td.length} entries shown
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Air Quality */}
          <div className="hist-section">
            <div className="section-title">🌬️ Air Quality Trends</div>
            <ChartCard title="PM10 & PM2.5 Daily Average (μg/m³)" hint>
              <ReactApexChart
                type="line"
                height={230}
                series={[
                  {
                    name: "PM10",
                    data: ta.map((d) =>
                      d.pm10 != null ? +d.pm10.toFixed(2) : null,
                    ),
                  },
                  {
                    name: "PM2.5",
                    data: ta.map((d) =>
                      d.pm25 != null ? +d.pm25.toFixed(2) : null,
                    ),
                  },
                ]}
                options={baseOptions({
                  categories: aDates,
                  unit: "μg/m³",
                  colors: ["#e07b22", "#d94f63"],
                  height: 230,
                })}
              />
            </ChartCard>
          </div>
        </>
      )}

      {!loading && !wData && !error && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">
            Select a date range and click Analyze Range
          </div>
          <div className="empty-sub">
            Explore up to 2 years of historical weather &amp; air quality data
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("current");
  const [location, setLocation] = useState(null);
  const [geoMsg, setGeoMsg] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoMsg("Geolocation not supported — using New Delhi as fallback.");
      setLocation({ lat: 28.6139, lon: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setGeoMsg("Location access denied — using New Delhi as fallback.");
        setLocation({ lat: 28.6139, lon: 77.209 });
      },
      { timeout: 9000 },
    );
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="brand">
            Sky<span>Lens</span>
          </div>

          <div className="nav-tabs">
            <button
              className={`nav-tab${tab === "current" ? " active" : ""}`}
              onClick={() => setTab("current")}
            >
              🌤️ Current Weather
            </button>

            <button
              className={`nav-tab${tab === "historical" ? " active" : ""}`}
              onClick={() => setTab("historical")}
            >
              📊 Historical Analysis
            </button>
          </div>
        </nav>

        <main className="main">
          {geoMsg && (
            <div className="error-box" style={{ marginBottom: 14 }}>
              📍 {geoMsg}
            </div>
          )}
          {tab === "current" && <CurrentPage location={location} />}
          {tab === "historical" && <HistoricalPage location={location} />}
        </main>
      </div>
    </>
  );
}
