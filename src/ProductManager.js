import fs from "fs/promises";
import { getRandomId } from "./utils/utils.js";
//Class ProductManager
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts() {
    return getJSONFromFile(this.path);
  }

  async addProduct(product) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = product;
    if (!(title && description && code && price && stock && category)) {
      console.log(
        `Add Error: One or more field is empty, the product wasn't add`
      );
    } else {
      const products = await getJSONFromFile(this.path);
      if (products.find((prod) => prod.code === code)) {
        console.log(`Add Error: The product code ${code} already exists`);
      } else {
        products.push({
          id: getRandomId(products),
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails,
        });
        await saveJSONToFile(this.path, products);
        console.log(`Product code ${code} its added`);
      }
    }
  }

  async getProductById(id) {
    const products = await getJSONFromFile(this.path);
    let product = products.find((prod) => prod.id === id);
    if (!product) {
      let noEncontrado = `The product with id ${id} doesn't exists`;
      return noEncontrado;
    } else {
      console.log("GetID", product);
      return product;
    }
  }

  async deleteProduct(id) {
    const products = await getJSONFromFile(this.path);
    let productToDelete = products.find((prod) => prod.id === id);
    if (!productToDelete) {
      console.log("Delete Error : The product doesn`t exists");
    } else {
      let filterProd = products.filter((p) => p.id !== id);
      saveJSONToFile(this.path, filterProd);
      console.log("The product has been removed");
    }
  }

  async updateProduct(
    id,
    updTitle,
    updDescription,
    updCode,
    updPrice,
    updStatus,
    updStock,
    updCategory,
    updThumbnails
  ) {
    const products = await getJSONFromFile(this.path);
    let findProduct = products.find((prod) => prod.id === id);
    if (!findProduct || !id) {
      console.log(`Product id ${id} not found`);
      return;
    } else {
      let filterProd = products.filter((p) => p.id !== id);
      let arrayProd = products.filter((p) => p.id === id);
      console.log("thumb", arrayProd[0].thumbnails);
      let updatedProducts = [
        ...filterProd,
        {
          id: id,
          title: updTitle,
          description: updDescription,
          code: updCode,
          price: updPrice,
          status: updStatus ?? true,
          stock: updStock,
          category: updCategory,
          thumbnails: [arrayProd[0].thumbnails, updThumbnails].flat(),
        },
      ];
      console.log("Updated with spread? ", updatedProducts);
      await saveJSONToFile(this.path, updatedProducts);
      console.log("Products updated");
    }
  }
}

//End Product Manager Class

const existFile = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  } else {
    let content;
    try {
      content = await fs.readFile(path, "utf-8");
    } catch (error) {
      throw new Error(`The file ${path} could not be read`);
    }
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`The file ${path} hasn't a JSON format`);
    }
  }
};

const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`The file ${path} couldn't be write`);
  }
};

//Testing

export const testingJSON = async () => {
  try {
    const testingProducts = new ProductManager("./productos.json");
    const products = await testingProducts.getProducts();
  } catch (error) {
    console.error(" Error: ", error.message);
  }
};

testingJSON();

export default ProductManager;
