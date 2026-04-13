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

const express = require("express");
const app = express();

app.use(express.json());

// проверка (чтобы видеть, что сервер обновился)
app.get("/", (req, res) => {
  res.send("ESTATEX WORKING ✅");
});

// данные в памяти
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// генерация ID (исправленная полностью)
const getNextId = () => {
  if (listings.length === 0) return 1;
  return Math.max(...listings.map(item => item.id)) + 1;
};

// получить все объявления
app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавить объявление
app.post("/listings", (req, res) => {
  const { title, price } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({
      error: "Нужно указать title и price"
    });
  }

  if (typeof price !== "number") {
    return res.status(400).json({
      error: "price должен быть числом"
    });
  }

  const newItem = {
    id: getNextId(),
    title,
    price
  };

  listings.push(newItem);

  res.status(201).json(newItem);
});

// удалить объявление
app.delete("/listings/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Неверный ID"
    });
  }

  const index = listings.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Не найдено"
    });
  }

  listings.splice(index, 1);

  res.json({
    message: "Удалено"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});
