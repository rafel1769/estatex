require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// подключение MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB подключен"))
.catch(err => console.log("Ошибка MongoDB:", err));

// схема
const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", listingSchema);

// ПРОВЕРКА СЕРВЕРА
app.get("/", (req, res) => {
  res.send("API работает 🚀");
});

// ПОЛУЧИТЬ ВСЕ (исправленный)
app.get("/listings", async (req, res) => {
  try {
    const data = await Listing.find().lean();
    res.json(data);
  } catch (err) {
    console.error("Ошибка GET:", err);
    res.status(500).json({
      error: "Ошибка получения данных",
      details: err.message
    });
  }
});

// ДОБАВИТЬ
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
    console.error("Ошибка POST:", err);
    res.status(500).json({
      error: "Ошибка сервера",
      details: err.message
    });
  }
});

// УДАЛИТЬ
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка DELETE:", err);
    res.status(500).json({
      error: "Ошибка удаления",
      details: err.message
    });
  }
});

// запуск
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
