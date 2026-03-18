import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== SCRAPER CONFIG ====================
const KAPOOK_URL = 'http://gasprice.kapook.com/gasprice.php';

const SELECTOR_CONFIG = {
  ptt: {
    name: 'ปตท. (PTT)', color: '#2563eb',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.ptt > ul > li:nth-child(1)', key: 'gsh95' },
      gasohol_e20: { sel: 'article.gasprice.ptt > ul > li:nth-child(2)', key: 'e20' },
      gasohol_e85: { sel: 'article.gasprice.ptt > ul > li:nth-child(3)', key: 'e85' },
      gasohol_91: { sel: 'article.gasprice.ptt > ul > li:nth-child(4)', key: 'gsh91' },
      gasoline_95: { sel: 'article.gasprice.ptt > ul > li:nth-child(5)', key: 'ben95' },
      ngv: { sel: 'article.gasprice.ptt > ul > li:nth-child(6)' },
      diesel_b7: { sel: 'article.gasprice.ptt > ul > li:nth-child(7)', key: 'diesel' },
      premium_diesel: { sel: 'article.gasprice.ptt > ul > li:nth-child(8)', key: 'dpre' },
      superpower_gasohol_95: { sel: 'article.gasprice.ptt > ul > li:nth-child(9)' },
      premium_gasohol_95: { sel: 'article.gasprice.ptt > ul > li:nth-child(10)' },
    }
  },
  bcp: {
    name: 'บางจาก (BCP)', color: '#16a34a',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.bcp > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.bcp > ul > li:nth-child(2)' },
      gasohol_e85: { sel: 'article.gasprice.bcp > ul > li:nth-child(3)' },
      gasohol_91: { sel: 'article.gasprice.bcp > ul > li:nth-child(4)' },
      diesel_b7: { sel: 'article.gasprice.bcp > ul > li:nth-child(5)' },
      premium_diesel: { sel: 'article.gasprice.bcp > ul > li:nth-child(6)' },
      premium_gasohol_95: { sel: 'article.gasprice.bcp > ul > li:nth-child(7)' },
      premium_gasohol_97: { sel: 'article.gasprice.bcp > ul > li:nth-child(8)' },
    }
  },
  shell: {
    name: 'เชลล์ (Shell)', color: '#dc2626',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.shell > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.shell > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.shell > ul > li:nth-child(3)' },
      diesel_b7: { sel: 'article.gasprice.shell > ul > li:nth-child(4)' },
      premium_diesel: { sel: 'article.gasprice.shell > ul > li:nth-child(5)' },
      vpower_gasohol_95: { sel: 'article.gasprice.shell > ul > li:nth-child(6)' },
      fuelsave_diesel: { sel: 'article.gasprice.shell > ul > li:nth-child(7)' },
      vpower_diesel: { sel: 'article.gasprice.shell > ul > li:nth-child(8)' },
      premium_gasohol_95: { sel: 'article.gasprice.shell > ul > li:nth-child(9)' },
    }
  },
  esso: {
    name: 'เอสโซ่ (Esso)', color: '#0ea5e9',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.esso > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.esso > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.esso > ul > li:nth-child(3)' },
      diesel_b7: { sel: 'article.gasprice.esso > ul > li:nth-child(4)' },
      premium_diesel: { sel: 'article.gasprice.esso > ul > li:nth-child(5)' },
      premium_gasohol_95: { sel: 'article.gasprice.esso > ul > li:nth-child(6)' },
    }
  },
  caltex: {
    name: 'คาลเท็กซ์ (Caltex)', color: '#e11d48',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.caltex > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.caltex > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.caltex > ul > li:nth-child(3)' },
      gasoline_95: { sel: 'article.gasprice.caltex > ul > li:nth-child(4)' },
      diesel_b7: { sel: 'article.gasprice.caltex > ul > li:nth-child(5)' },
      premium_diesel: { sel: 'article.gasprice.caltex > ul > li:nth-child(6)' },
    }
  },
  pt: {
    name: 'PT Energy', color: '#a855f7',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.pt > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.pt > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.pt > ul > li:nth-child(3)' },
      gasoline_95: { sel: 'article.gasprice.pt > ul > li:nth-child(4)' },
      diesel_b7: { sel: 'article.gasprice.pt > ul > li:nth-child(5)' },
    }
  },
  susco: {
    name: 'ซัสโก้ (Susco)', color: '#ec4899',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.susco > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.susco > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.susco > ul > li:nth-child(3)' },
      gasoline_95: { sel: 'article.gasprice.susco > ul > li:nth-child(4)' },
      ngv: { sel: 'article.gasprice.susco > ul > li:nth-child(5)' },
      diesel_b7: { sel: 'article.gasprice.susco > ul > li:nth-child(6)' },
    }
  },
  pure: {
    name: 'PURE', color: '#10b981',
    fuels: {
      gasohol_95: { sel: 'article.gasprice.pure > ul > li:nth-child(1)' },
      gasohol_e20: { sel: 'article.gasprice.pure > ul > li:nth-child(2)' },
      gasohol_91: { sel: 'article.gasprice.pure > ul > li:nth-child(3)' },
      diesel_b7: { sel: 'article.gasprice.pure > ul > li:nth-child(4)' },
    }
  },
};

// Province transport surcharges (baht/liter)
const PROVINCES = {
  'กลาง':{'กรุงเทพฯ':0,'นนทบุรี':0,'ปทุมธานี':0,'สมุทรปราการ':0,'สมุทรสาคร':.05,'นครปฐม':.08,'อยุธยา':.10,'อ่างทอง':.15,'ลพบุรี':.20,'สิงห์บุรี':.18,'ชัยนาท':.22,'สระบุรี':.15,'นครนายก':.18,'สุพรรณบุรี':.15,'กาญจนบุรี':.25,'ราชบุรี':.18,'เพชรบุรี':.22,'ประจวบฯ':.35,'สมุทรสงคราม':.12},
  'เหนือ':{'เชียงใหม่':.65,'เชียงราย':.80,'ลำพูน':.62,'ลำปาง':.55,'แพร่':.58,'น่าน':.85,'พะเยา':.72,'แม่ฮ่องสอน':1.20,'อุตรดิตถ์':.45,'พิษณุโลก':.38,'สุโขทัย':.42,'ตาก':.60,'พิจิตร':.32,'เพชรบูรณ์':.40,'กำแพงเพชร':.38,'นครสวรรค์':.28,'อุทัยธานี':.30},
  'อีสาน':{'นครราชสีมา':.25,'บุรีรัมย์':.35,'สุรินทร์':.40,'ศรีสะเกษ':.45,'อุบลราชธานี':.50,'ยโสธร':.48,'อำนาจเจริญ':.52,'ชัยภูมิ':.30,'ขอนแก่น':.38,'อุดรธานี':.48,'หนองคาย':.55,'เลย':.60,'หนองบัวลำภู':.50,'มหาสารคาม':.40,'ร้อยเอ็ด':.42,'กาฬสินธุ์':.45,'สกลนคร':.55,'นครพนม':.60,'มุกดาหาร':.55,'บึงกาฬ':.62},
  'ตะวันออก':{'ชลบุรี':.10,'ระยอง':.05,'จันทบุรี':.30,'ตราด':.40,'ฉะเชิงเทรา':.08,'ปราจีนบุรี':.18,'สระแก้ว':.28},
  'ใต้':{'ชุมพร':.45,'ระนอง':.55,'สุราษฎร์ธานี':.50,'นครศรีฯ':.60,'กระบี่':.65,'พังงา':.68,'ภูเก็ต':.72,'สงขลา':.70,'สตูล':.80,'ตรัง':.68,'พัทลุง':.65,'ปัตตานี':.78,'ยะลา':.85,'นราธิวาส':.90}
};

// ==================== CACHE ====================
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function scrapePrices() {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }

  // Retry up to 3 times
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[SCRAPER] Attempt ${attempt} — fetching from kapook...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(KAPOOK_URL, { 
        signal: controller.signal,
        headers: { 'User-Agent': 'TIMMMEN/1.0 (+https://www.timmmen.com)' }
      });
      clearTimeout(timeout);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      if (html.length < 500) throw new Error('Response too short');
      
      const $ = cheerio.load(html);

  // Date
  const dateText = $('body > section > h2').text().split(' ');
  const date = dateText.length >= 4 ? `${dateText[1]} ${dateText[2]} ${dateText[3]}` : 'N/A';

  // Stations
  const stations = {};
  for (const [stKey, stConfig] of Object.entries(SELECTOR_CONFIG)) {
    const fuels = {};
    for (const [fKey, fConfig] of Object.entries(stConfig.fuels)) {
      const name = $(fConfig.sel + ' > span').text().trim();
      const priceStr = $(fConfig.sel + ' > em').text().trim();
      const price = parseFloat(priceStr);
      if (name && !isNaN(price)) {
        fuels[name] = { p: price, ch: 0 };
      }
    }
    if (Object.keys(fuels).length > 0) {
      stations[stConfig.name] = { c: stConfig.color, f: fuels };
    }
  }

  // Base prices from PTT
  const ptt = stations['ปตท. (PTT)'];
  const base = ptt ? {
    gsh95: findPrice(ptt.f, 'แก๊สโซฮอล์ 95') || 0,
    gsh91: findPrice(ptt.f, 'แก๊สโซฮอล์ 91') || 0,
    e20: findPrice(ptt.f, 'แก๊สโซฮอล์ E20') || 0,
    e85: findPrice(ptt.f, 'แก๊สโซฮอล์ E85') || 0,
    diesel: findPrice(ptt.f, 'ดีเซล B7') || findPrice(ptt.f, 'ดีเซล') || 0,
    dpre: findPrice(ptt.f, 'ดีเซลพรีเมี่ยม') || 0,
    ben95: findPrice(ptt.f, 'เบนซิน 95') || 0,
  } : {};

  const result = { date, effective: `มีผล ${date}`, stations, base, provinces: PROVINCES, fetchedAt: new Date().toISOString() };

  cache = { data: result, timestamp: now };
  console.log(`[SCRAPER] OK — ${date} — ${Object.keys(stations).length} stations`);
  return result;
    } catch (e) {
      lastError = e;
      console.error(`[SCRAPER] Attempt ${attempt} failed:`, e.message);
      if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt)); // wait before retry
    }
  }
  throw lastError || new Error('All retries failed');
}

function findPrice(fuels, keyword) {
  for (const [name, data] of Object.entries(fuels)) {
    if (name.includes(keyword)) return data.p;
  }
  return null;
}

// ==================== FALLBACK DATA 18 มี.ค. 2569 ====================
const FALLBACK_DATA = {
  date: '18 มีนาคม 2569', effective: 'มีผล 18 มี.ค. 69 เวลา 05:00 น.',
  stations: {
    'ปตท. (PTT)': { c: '#2563eb', f: {
      'แก๊สโซฮอล์ 95': { p: 32.05, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 31.68, ch: 1.00 },
      'แก๊สโซฮอล์ E20': { p: 27.05, ch: -0.79 }, 'แก๊สโซฮอล์ E85': { p: 23.79, ch: -2.00 },
      'เบนซิน 95': { p: 40.64, ch: 1.00 }, 'Super GSH 95': { p: 41.04, ch: 1.00 },
      'ดีเซล B7': { p: 30.44, ch: 0.50 }, 'ดีเซลพรีเมี่ยม': { p: 43.94, ch: 0.50 }
    }},
    'บางจาก (BCP)': { c: '#16a34a', f: {
      'แก๊สโซฮอล์ 95': { p: 32.05, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 31.68, ch: 1.00 },
      'แก๊สโซฮอล์ E20': { p: 27.05, ch: -0.79 }, 'แก๊สโซฮอล์ E85': { p: 23.79, ch: -2.00 },
      'Hi Premium 97': { p: 49.54, ch: 0 }, 'Hi Diesel S': { p: 30.44, ch: 0.50 },
      'Hi Premium Diesel S': { p: 46.14, ch: 0.50 }
    }},
    'เชลล์ (Shell)': { c: '#dc2626', f: {
      'แก๊สโซฮอล์ 95': { p: 33.35, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 32.78, ch: 1.00 },
      'แก๊สโซฮอล์ E20': { p: 28.15, ch: -0.79 },
      'V-Power GSH 95': { p: 49.84, ch: 0 }, 'ดีเซล': { p: 30.44, ch: 0.50 },
      'V-Power ดีเซล': { p: 49.84, ch: 0 }
    }},
    'เอสโซ่ (Esso)': { c: '#0ea5e9', f: {
      'แก๊สโซฮอล์ 95': { p: 32.05, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 31.68, ch: 1.00 },
      'แก๊สโซฮอล์ E20': { p: 27.05, ch: -0.79 },
      'ดีเซล': { p: 30.44, ch: 0.50 }, 'ดีเซลพรีเมี่ยม': { p: 46.14, ch: 0.50 }
    }},
    'คาลเท็กซ์ (Caltex)': { c: '#e11d48', f: {
      'แก๊สโซฮอล์ 95': { p: 32.05, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 31.68, ch: 1.00 },
      'ดีเซล': { p: 30.44, ch: 0.50 }
    }},
    'PT Energy': { c: '#a855f7', f: {
      'แก๊สโซฮอล์ 95': { p: 32.05, ch: 1.00 }, 'แก๊สโซฮอล์ 91': { p: 31.68, ch: 1.00 },
      'แก๊สโซฮอล์ E20': { p: 27.05, ch: -0.79 },
      'เบนซิน 95': { p: 41.14, ch: 1.00 }, 'ดีเซล': { p: 30.44, ch: 0.50 }
    }}
  },
  base: { gsh95: 32.05, gsh91: 31.68, e20: 27.05, e85: 23.79, diesel: 30.44, dpre: 43.94, ben95: 40.64 },
  provinces: PROVINCES,
  fetchedAt: '2026-03-18T05:00:00Z'
};

// ==================== API ROUTES ====================
app.get('/api/prices', async (req, res) => {
  try {
    const data = await scrapePrices();
    res.json({ status: 'success', data });
  } catch (e) {
    console.error('[API ERROR]', e.message);
    // Return cache if available, otherwise fallback
    if (cache.data) {
      res.json({ status: 'success', data: cache.data, stale: true });
    } else {
      console.log('[API] Using fallback data');
      res.json({ status: 'success', data: FALLBACK_DATA, stale: true });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cached: !!cache.data, cacheAge: cache.timestamp ? Math.round((Date.now() - cache.timestamp) / 1000) + 's' : null });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 TIMMMEN.com server running on port ${PORT}`);
  console.log(`   http://localhost:${PORT}`);
  // Pre-fetch on startup
  scrapePrices().then(() => console.log('[INIT] First fetch done')).catch(e => console.error('[INIT] First fetch failed:', e.message));
  // Auto-refresh every 5 minutes in background
  setInterval(() => {
    console.log('[AUTO] Refreshing prices...');
    cache.timestamp = 0; // force refresh
    scrapePrices().then(() => console.log('[AUTO] Refresh done')).catch(e => console.error('[AUTO] Refresh failed:', e.message));
  }, 5 * 60 * 1000);
});
