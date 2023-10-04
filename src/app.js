//Entregable 3 Express BackEnd Coder
//Server Express
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));

//Importo la clase productManager
import productManager from "./ProductManager.js";
const testingProducts = new productManager("./data.json");

//EndPoints

app.get("/", (req, res) => {
  const htmlText = '<h1 style="color:blue">Entrega 3 servidor express</h1>';
  res.send(htmlText);
});

app.get("/products/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    pid = parseInt(pid);
    const productID = await testingProducts.getProductById(pid);
    if (!productID) {
      res.json({
        error: "Product Not Found",
        message: `The product id ${pid} not found`,
      });
    } else {
      res.send(productID);
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await testingProducts.getProducts();
    const { limit } = req.query;
    let prodFilter;
    if (limit <= 10) {
      prodFilter = products.filter((p) => p.id <= limit);
      res.send(prodFilter);
    } else {
      res.send(products);
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(8080, () => {
  console.log("Server listening at port 8080");
});
