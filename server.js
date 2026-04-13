const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(".")); // чтобы index.html открывался

// данные (пока в памяти)
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// генерация ID
const getNextId = () => {
  return listings.length
    ? Math.max(...listings.map(item => item.id)) + 1
    : 1;
};

// тест
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// получить все
app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавить
app.post("/listings", (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || typeof price !== "number") {
      return res.status(400).json({ error: "Неверные данные" });
    }

    const newItem = {
      id: getNextId(),
      title,
      price
    };

    listings.push(newItem);
    res.status(201).json(newItem);

  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// удалить
app.delete("/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  listings = listings.filter(item => item.id !== id);

  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});
