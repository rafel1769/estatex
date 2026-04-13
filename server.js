const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/listings", (req, res) => {
  res.json([
    { id: 1, title: "Квартира", price: 50000 },
    { id: 2, title: "Дом", price: 120000 }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
