

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // важно!

// память (без базы)
let listings = [];

// получить все
app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавить
app.post("/listings", (req, res) => {
  const { title, price, city, description } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Заполни название и цену" });
  }

  const newItem = {
    id: Date.now(),
    title,
    price,
    city: city || "-",
    description: description || "-"
  };

  listings.push(newItem);
  res.json(newItem);
});

// удалить
app.delete("/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  listings = listings.filter(item => item.id !== id);

  res.json({ success: true });
});

// запуск
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
