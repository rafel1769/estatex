const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB подключена"))
.catch(err => console.log(err));

const Listing = mongoose.model("Listing", {
  title: String,
  price: Number,
  city: String,
  description: String,
  image: String
});

app.get("/listings", async (req, res) => {
  const data = await Listing.find();
  res.json(data);
});

app.post("/listings", upload.single("image"), async (req, res) => {
  const { title, price, city, description } = req.body;

  const listing = new Listing({
    title,
    price,
    city,
    description,
    image: req.file ? req.file.filename : null
  });

  await listing.save();
  res.json({ message: "Добавлено" });
});

app.delete("/listings/:id", async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Удалено" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Сервер запущен"));});
