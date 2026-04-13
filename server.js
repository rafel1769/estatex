const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// подключение к MongoDB
mongoose.connect("mongodb+srv://admin:admin1234@cluster0.6egosvb.mongodb.net/estatex?retryWrites=true&w=majority")
.then(() => console.log("MongoDB подключен"))
.catch(err => console.log(err));

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// схема
const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", listingSchema);

// получить все
app.get("/listings", async (req, res) => {
  const data = await Listing.find();
  res.json(data);
});

// добавить
app.post("/listings", async (req, res) => {
  const { title, price, city, description } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Заполни название и цену" });
  }

  const newItem = new Listing({
    title,
    price,
    city: city || "-",
    description: description || "-"
  });

  await newItem.save();
  res.json(newItem);
});

// удалить
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// запуск
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
