require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// главная
app.get("/", (req, res) => {
  res.send("🚀 ESTATEX работает!");
});

// listings
app.get("/listings", (req, res) => {
  res.json([
    { id: 1, title: "Квартира", price: 50000 },
    { id: 2, title: "Дом", price: 80000 }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started");
});
