require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// главная страница
app.get("/", (req, res) => {
  res.send(`
    <h1>🏠 ESTATEX</h1>
    <p>Платформа недвижимости</p>
    <a href="/listings">Смотреть объявления</a>
  `);
});

// listings (ВАЖНО!)
app.get("/listings", (req, res) => {
  res.json([
    { id: 1, title: "Квартира", price: 50000 },
    { id: 2, title: "Дом", price: 120000 }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
