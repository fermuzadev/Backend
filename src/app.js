import express from "express";
import prodRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", prodRouter, cartsRouter);

app.get("/", (req, res) => {
  res.send("<h1>Proyecto Final - Primera Entrega</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
