require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const listings = [
  { id: 1, title: "Квартира", price: 50000 },
  { id: 2, title: "Дом", price: 120000 }
];

app.get("/listings", (req, res) => {
  res.json(listings);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started");
});
