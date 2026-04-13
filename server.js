require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// Хранилище (в памяти)
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// Главная
app.get("/", (req, res) => {
  res.send("🚀 ESTATEX работает!");
});

// Получить все объявления
app.get("/listings", (req, res) => {
  res.json(listings);
});

// Добавить объявление
app.post("/listings", (req, res) => {
  const { title, price } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "title и price обязательны" });
  }

  const newItem = {
    id: listings.length + 1,
    title,
    price
  };

  listings.push(newItem);

  res.json(newItem);
});

// PORT для Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
