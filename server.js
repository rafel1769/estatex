const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// ===== НАСТРОЙКА =====
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ===== MULTER (загрузка фото) =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ===== БАЗА (JSON) =====
const DB_FILE = "db.json";

function loadAds() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveAds(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ГЛАВНАЯ СТРАНИЦА =====
app.get("/", (req, res) => {
  const ads = loadAds();

  const html = `
  <html>
  <head>
    <title>ESTATEX</title>
    <style>
      body { font-family: Arial; background: #0f1e2e; color: white; text-align: center; }
      input, button { padding: 10px; margin: 5px; border-radius: 6px; border: none; }
      button { background: #3b82f6; color: white; cursor: pointer; }
      .card { background: #1f2f44; padding: 15px; margin: 20px auto; width: 300px; border-radius: 10px; }
      img { width: 100%; border-radius: 8px; margin-top: 10px; }
    </style>
  </head>
  <body>

  <h1>🚀 ESTATEX</h1>

  <form action="/add" method="POST" enctype="multipart/form-data">
    <input name="title" placeholder="Название" required />
    <input name="price" placeholder="Цена" required />
    <input type="file" name="image" />
    <button>Создать</button>
  </form>

  <h2>Объявления</h2>

  ${ads.map(ad => `
    <div class="card">
      <h3>${ad.title}</h3>
      <p>💰 ${ad.price}</p>
      <p>👍 ${ad.likes}</p>

      ${ad.image ? `<img src="${ad.image}" />` : ""}

      <form action="/like/${ad.id}" method="POST">
        <button>👍</button>
      </form>

      <form action="/delete/${ad.id}" method="POST">
        <button style="background:red;">❌</button>
      </form>
    </div>
  `).join("")}

  </body>
  </html>
  `;

  res.send(html);
});

// ===== ДОБАВИТЬ =====
app.post("/add", upload.single("image"), (req, res) => {
  const ads = loadAds();

  const image = req.file ? "/uploads/" + req.file.filename : "";

  ads.push({
    id: Date.now(),
    title: req.body.title,
    price: req.body.price,
    image,
    likes: 0
  });

  saveAds(ads);
  res.redirect("/");
});

// ===== ЛАЙК =====
app.post("/like/:id", (req, res) => {
  const ads = loadAds();
  const id = Number(req.params.id);

  const ad = ads.find(a => a.id === id);
  if (ad) ad.likes++;

  saveAds(ads);
  res.redirect("/");
});

// ===== УДАЛИТЬ =====
app.post("/delete/:id", (req, res) => {
  let ads = loadAds();
  const id = Number(req.params.id);

  ads = ads.filter(a => a.id !== id);

  saveAds(ads);
  res.redirect("/");
});

// ===== СТАРТ =====
app.listen(PORT, () => {
  console.log("🚀 Server started on http://localhost:" + PORT);
});




















