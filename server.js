const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // ВАЖНО для index.html

// MongoDB подключение
mongoose.connect("mongodb+srv://admin:admin1234@cluster0.6egosvb.mongodb.net/estatex?retryWrites=true&w=majority")
.then(() => console.log("MongoDB подключен"))
.catch(err => console.error("Ошибка MongoDB:", err));

// схема
const listingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  city: String,
  description: String
});

const Listing = mongoose.model("Listing", listingSchema);

// GET
app.get("/listings", async (req, res) => {
  try {
    const data = await Listing.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения данных" });
  }
});

// POST (исправленный)
app.post("/listings", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Нет данных" });
    }

    const title = req.body.title;
    const price = req.body.price;
    const city = req.body.city;
    const description = req.body.description;

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
    console.error("Ошибка при добавлении:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// DELETE
app.delete("/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка удаления" });
  }
});

// запуск
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
