require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// ✅ ПРАВИЛЬНОЕ подключение Mongo (без старых параметров)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ MongoDB подключен"))
.catch(err => console.log("❌ Ошибка MongoDB:", err));

// схема
const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", listingSchema);

// тест
app.get("/", (req, res) => {
  res.send("API работает");
});

// GET
app.get("/listings", async (req, res) => {
  try {
    const data = await Listing.find();
    res.json(data);
  } catch (err) {
    console.log("GET ошибка:", err);
    res.status(500).json({
      error: "Ошибка получения данных",
      details: err.message
    });
  }
});

// POST
app.post("/listings", async (req, res) => {
  try {
    const { title, price, city, description } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Заполни название и цену" });
    }

    const newItem = new Listing({
      title,
      price,
      city,
      description
    });

    await newItem.save();

    res.json(newItem);
  } catch (err) {
    console.log("POST ошибка:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// DELETE
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.log("DELETE ошибка:", err);
    res.status(500).json({ error: "Ошибка удаления" });
  }
});

// запуск
app.listen(PORT, () => {
  console.log("🚀 Сервер запущен на порту " + PORT);
});
