const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// создаём папку uploads если её нет
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// раздача файлов
app.use("/uploads", express.static("uploads"));

// настройка загрузки
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// подключение к базе
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB подключено"))
  .catch(err => console.log(err));

// модель
const Listing = mongoose.model("Listing", {
  title: String,
  price: Number,
  city: String,
  description: String,
  image: String
});

// получить
app.get("/listings", async (req, res) => {
  const data = await Listing.find();
  res.json(data);
});

// добавить
app.post("/listings", upload.single("image"), async (req, res) => {
  try {
    const { title, price, city, description } = req.body;

    const listing = new Listing({
      title,
      price,
      city,
      description,
      image: req.file ? req.file.filename : ""
    });

    await listing.save();
    res.json({ message: "добавлено" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// удалить
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "удалено" });
});

// запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("сервер запущен"));
