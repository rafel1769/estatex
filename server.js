const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const FILE = "data.json";

// читаем файл
function readData() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// записываем файл
function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// получить все
app.get("/listings", (req, res) => {
  const listings = readData();
  res.json(listings);
});

// добавить
app.post("/listings", (req, res) => {
  const { title, price, city, description } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Заполни название и цену" });
  }

  const listings = readData();

  const newItem = {
    id: Date.now(),
    title,
    price,
    city: city || "-",
    description: description || "-"
  };

  listings.push(newItem);
  writeData(listings);

  res.json(newItem);
});

// удалить
app.delete("/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  let listings = readData();
  listings = listings.filter(item => item.id !== id);

  writeData(listings);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
