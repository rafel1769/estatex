require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// Главная
app.get("/", (req, res) => {
  res.send("🚀 ESTATEX работает!");
});

// Listings (главный маршрут)
app.get("/listings", (req, res) => {
  res.json([
    { id: 1, title: "Квартира", price: 50000 },
    { id: 2, title: "Дом", price: 120000 }
  ]);
});

// PORT для Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
