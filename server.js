require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// 👉 ПОДКЛЮЧЕНИЕ К MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB подключена"))
.catch(err => console.log(err));

// 👉 СХЕМА
const Listing = mongoose.model("Listing", {
  title: String,
  price: Number,
  city: String,
  description: String
});

// 👉 ПОЛУЧИТЬ ВСЕ
app.get("/listings", async (req, res) => {
  const data = await Listing.find();
  res.json(data);
});

// 👉 ДОБАВИТЬ
app.post("/listings", async (req, res) => {
  try {
    const { title, price, city, description } = req.body;

    const newItem = new Listing({
      title,
      price,
      city,
      description
    });

    await newItem.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 УДАЛИТЬ
app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server работает"));
