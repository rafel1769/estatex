require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Подключение к MongoDB (БЕЗ СТАРЫХ ОПЦИЙ!)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.log("❌ Ошибка MongoDB:", err));

// ✅ Схема
const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", listingSchema);

// ✅ Проверка
app.get("/", (req, res) => {
  res.send("API работает 🚀");
});

// ✅ Получить все
app.get("/listings", async (req, res) => {
  try {
    const data = await Listing.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения данных" });
  }
});

// ✅ Добавить
app.post("/listings", async (req, res) => {
  try {
    const { title, price, city, description } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Заполните поля" });
    }

    const newItem = new Listing({ title, price, city, description });
    await newItem.save();

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ✅ Удалить
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
});

// 🔥 ВОТ ТО, ЧЕГО У ТЕБЯ НЕ БЫЛО
app.get("/seed", async (req, res) => {
  try {
    await Listing.deleteMany();

    await Listing.create([
      { title: "Дом", price: 100000, city: "Ташкент", description: "Красивый дом" },
      { title: "Квартира", price: 50000, city: "Самарканд", description: "Центр города" }
    ]);

    res.json({ message: "Данные добавлены" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 запуск
app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});
