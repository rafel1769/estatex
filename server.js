require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// Главная страница
app.get("/", (req, res) => {
  res.send("🚀 ESTATEX работает!");
});

// ВАЖНО — маршрут listings
app.get("/listings", (req, res) => {
  res.json([
    { id: 1, title: "Квартира в Ташкенте", price: 50000 },
    { id: 2, title: "Дом в Самарканде", price: 80000 }
  ]);
});

// Порт
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
