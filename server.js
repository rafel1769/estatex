require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// тест
app.get("/", (req, res) => {
  res.send("🚀 ESTATEX работает!");
});

// список объявлений
let listings = [];

app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавление объявления
app.post("/listings", (req, res) => {
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    price: req.body.price
  };

  listings.push(newItem);
  res.json(newItem);
});

// порт
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});











