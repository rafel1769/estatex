const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static(".", { etag: false }));

// 🔗 MongoDB
const MONGO_URL = "mongodb+srv://admin:admin1234@cluster0.6egosvb.mongodb.net/estatex";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.log("❌ Ошибка MongoDB:", err));


// 📦 СХЕМА
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


// 📄 Получить все
app.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ _id: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки" });
  }
});


// ➕ Добавить
app.post("/listings", async (req, res) => {
  try {
    let { title, price, city, description } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Нет данных" });
    }

    price = Number(price);

    const newListing = new Listing({
      title,
      price,
      city: city || "",
      description: description || ""
    });

    await newListing.save();

    res.json(newListing);

  } catch (err) {
    console.log("❌ Ошибка:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


// ❌ Удалить
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Сервер запущен на порту " + PORT);
});
