const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(".")); 

let listings = [];

const getNextId = () => {
  return listings.length
    ? Math.max(...listings.map(item => item.id)) + 1
    : 1;
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/listings", (req, res) => {
  res.json(listings);
});

app.post("/listings", (req, res) => {
  const { title, price, location, description } = req.body;

  const newItem = {
    id: getNextId(),
    title,
    price,
    location,
    description
  };

  listings.push(newItem);
  res.json(newItem);
});

app.delete("/listings/:id", (req, res) => {
  const id = Number(req.params.id);
  listings = listings.filter(item => item.id !== id);
  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Сервер запущен на порту " + PORT);
});
