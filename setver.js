const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static(".")); // для index.html

// 🔥 ПОДКЛЮЧЕНИЕ К MONGODB
mongoose.connect("mongodb+srv://admin:admin1234@cluster0.6egosvb.mongodb.net/estatex?retryWrites=true&w=majority")
.then(() => console.log("MongoDB подключена"))
.catch(err => console.log(err));

// 📦 СХЕМА
const ListingSchema = new mongoose.Schema({
  title: String,
  price: Number
});

const Listing = mongoose.model("Listing", ListingSchema);

// 👉 Главная страница
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 📄 Получить все
app.get("/listings", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

// ➕ Добавить
app.post("/listings", async (req, res) => {
  const { title, price } = req.body;

  if (!title || typeof price !== "number") {
    return res.status(400).json({ error: "Неверные данные" });
  }

  const newItem = new Listing({ title, price });
  await newItem.save();

  res.status(201).json(newItem);
});

// ❌ Удалить
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер работает на порту " + PORT);
});
