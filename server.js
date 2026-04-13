const express = require("express");
const app = express();

app.use(express.json());

// тест чтобы понять обновился ли сервер
app.get("/", (req, res) => {
  res.send("ESTATEX WORKING ✅");
});

// данные в памяти
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// генерация ID
const getNextId = () => {
  return listings.length ? Math.max(...listings.map(i => i.id)) + 1 : 1;
};

// получить все
app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавить
app.post("/listings", (req, res) => {
  const { title, price } = req.body;

  if (!title || typeof price !== "number") {
    return res.status(400).json({ error: "title и price обязательны" });
  }

  const newItem = {
    id: getNextId(),
    title,
    price
  };

  listings.push(newItem);
  res.status(201).json(newItem);
});

// удалить
app.delete("/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = listings.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Не найдено" });
  }

  listings.splice(index, 1);
  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER STARTED 🚀");
});
