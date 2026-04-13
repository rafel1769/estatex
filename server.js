require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// ЖЁСТКО задаём данные (без файлов, без db.json)
const listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// Проверка
app.get("/", (req, res) => {
  res.send("OK");
});

// Получить список
app.get("/listings", (req, res) => {
  res.json(listings);
});

// Порт (важно для Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started");
});
