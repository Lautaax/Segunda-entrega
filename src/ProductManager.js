import fs from "fs";
import { Blob } from "buffer";

export default class ProductManager {
  constructor() {
    this.dir = "./files";
    this.path = "./files/products.json";
  }

  getProducts = async (logProducts) => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.path)) {
        const productData = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([productData]).size;
        if (size > 0) {
          const parsedProducts = JSON.parse(productData);
          if (logProducts === "log") {
            console.table(parsedProducts);
          }
          return parsedProducts;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (productId) => {
    try {
      const products = await this.getProducts();
      const filteredProduct = products.filter((prod) => prod.id === parseInt(productId));
      return filteredProduct;
    } catch (error) {
      console.log(error)
    }
  };

  addProduct = async (product) => {
    try {
      product.stock > 0
        ? product = { status: true, ...product}
        : product = { status: false, ...product}

      if (product.thumbnails[0].hasOwnProperty("fieldname")) {
        const imgPaths = product.thumbnails.map(prod => prod.path);
        product.thumbnails = imgPaths;
      }

      const products = await this.getProducts();
      const productIndex = await products.findIndex((prod) => prod.code === product.code);
      
      if (productIndex === -1) {
        products.length === 0 
          ? product = { id: 1, ...product}
          : product = { id: products[products.length - 1].id + 1, ...product}
        products.push(product);
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        return product;
      } 
    } catch (error) {
      console.log(error)
    }
  };

  updateProduct = async (productId, updates) => {
    try {
      const products = await this.getProducts();
      const productIdFound = products.findIndex((prod) => prod.id === parseInt(productId));

      if (productIdFound !== -1) {
        const updatedProduct = { ...products[productIdFound], ...updates}
        products[productIdFound] = updatedProduct;
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
      } else {
        return productIdFound
      }
    } catch (error) {
      console.log(error)
    }
  };

  deleteProduct = async (productId) => {
    try {
      const products = await this.getProducts();
      const productIdFound = products.findIndex((prod) => prod.id === parseInt(productId));
      if (productIdFound !== -1) {
        products.splice(productIdFound, 1);
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
      } else {
        return productIdFound
      }
    } catch (error) {
      console.log(error)
    }
  };
}