# ⛽ TIMMMEN.com — เติมน้ำมัน เช็คราคาเรียลไทม์

เว็บไซต์เช็คราคาน้ำมันในประเทศไทย อัปเดตเรียลไทม์ ครบทุกปั๊ม ทุกจังหวัด

🌐 **www.timmmen.com**

## ✨ Features

- **ข้อมูลจริง** จาก สนพ. กระทรวงพลังงาน
- **อัปเดตอัตโนมัติ** ทุก 60 วินาที
- **ครบทุกปั๊ม** — ปตท., บางจาก, เชลล์, เอสโซ่, คาลเท็กซ์, PT, ซัสโก้, PURE
- **77 จังหวัด** พร้อมราคาคำนวณจาก กทม. + ค่าขนส่ง + ภาษีท้องถิ่น
- **Responsive** — มือถือ, แท็บเล็ต, คอม ดูดีทุกจอ
- **Server-side caching** 5 นาที

## 🚀 วิธีติดตั้ง

```bash
git clone <your-repo-url>
cd timmmen
npm install
npm start
# → http://localhost:3000
```

### Development mode
```bash
npm run dev
```

## 🌐 Deploy ขึ้นเว็บจริง

### Railway (แนะนำ, ฟรี)
1. สร้าง account ที่ [railway.app](https://railway.app)
2. เชื่อม GitHub repo
3. Set `PORT=3000`
4. Deploy! ได้ URL เลย

### Render (ฟรี)
1. สร้าง account ที่ [render.com](https://render.com)
2. New → Web Service → เชื่อม repo
3. Build: `npm install` / Start: `npm start`

### Docker
```bash
docker build -t timmmen .
docker run -p 3000:3000 timmmen
```

### VPS + PM2
```bash
npm install -g pm2
pm2 start server.js --name timmmen
pm2 save && pm2 startup
```

## 📡 API

| Endpoint | Description |
|----------|-------------|
| `GET /api/prices` | ราคาน้ำมันล่าสุด + จังหวัด |
| `GET /api/health` | Health check |

## 📁 โครงสร้าง

```
timmmen/
├── server.js          # Backend + scraper
├── package.json
├── Dockerfile
├── README.md
└── public/
    └── index.html     # Frontend
```

## 🔗 ตั้งค่า Custom Domain (timmmen.com)

เมื่อ deploy แล้ว ชี้โดเมนมาที่ server:
1. จดโดเมน `timmmen.com`
2. ตั้ง DNS: `A record` → IP ของ server หรือ `CNAME` → URL ที่ Railway/Render ให้
3. เปิด SSL (Railway/Render ทำให้อัตโนมัติ)

## 📝 License

MIT
