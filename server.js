const express = require("express");
const app = express();

// чтобы сервер понимал JSON
app.use(express.json());

// тестовый маршрут
app.get("/", (req, res) => {
  res.send("🚀 Estatex работает!");
});

// пример API
app.get("/api", (req, res) => {
  res.json({ message: "API работает" });
});

// ВАЖНО для Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
















