const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("."));

// 🔥 ТВОЯ БАЗА (уже вставил)
const MONGO_URL = "mongodb+srv://admin:admin1234@cluster0.6egosvb.mongodb.net/estatex";

// 🔗 Подключение к MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.log("❌ Ошибка MongoDB", err));


// 📦 СХЕМА (как будет храниться объявление)
const ListingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", ListingSchema);


// 🏠 Главная
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// 📄 Получить все объявления
app.get("/listings", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});


// ➕ Добавить объявление
app.post("/listings", async (req, res) => {
  try {
    const { title, price, city, description } = req.body;

    const newListing = new Listing({
      title,
      price,
      city,
      description
    });

    await newListing.save();

    res.json(newListing);

  } catch (err) {
    res.status(500).json({ error: "Ошибка" });
  }
});


// ❌ Удалить
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Сервер запущен на порту " + PORT);
});
