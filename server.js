const express = require("express");
const app = express();

app.use(express.json());

// данные в памяти (без базы)
let listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

// генерация ID
function getNextId() {
  let max = 0;
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id > max) {
      max = listings[i].id;
    }
  }
  return max + 1;
}

// получить все
app.get("/listings", (req, res) => {
  res.json(listings);
});

// добавить
app.post("/listings", (req, res) => {
  const title = req.body.title;
  const price = req.body.price;

  if (!title || price === undefined) {
    return res.status(400).json({ error: "Нужно title и price" });
  }

  if (typeof price !== "number") {
    return res.status(400).json({ error: "price должен быть числом" });
  }

  const newItem = {
    id: getNextId(),
    title: title,
    price: price
  };

  listings.push(newItem);

  res.status(201).json(newItem);
});

// удалить
app.delete("/listings/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Неверный ID" });
  }

  const index = listings.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Не найдено" });
  }

  listings.splice(index, 1);

  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер работает на порту " + PORT);
});
