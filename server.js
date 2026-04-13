const express = require("express");
const app = express();

app.use(express.json());

// ДАННЫЕ (ТОЛЬКО ЧИСЛА)
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// ВСЕГДА ЧИСТИМ ДАННЫЕ
app.get("/listings", (req, res) => {
  const result = listings.map(item => ({
    id: Number(item.id),
    title: item.title,
    price: Number(item.price)
  }));

  res.json(result);
});

// ДОБАВЛЕНИЕ
app.post("/listings", (req, res) => {
  const { title, price } = req.body;

  const newItem = {
    id: listings.length + 1,
    title: title,
    price: Number(price)
  };

  listings.push(newItem);
  res.json(newItem);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
