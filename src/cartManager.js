import fs from "fs";
import { Blob } from "buffer";

export default class CartManager {
  constructor() {
    this.dir = "./files";
    this.path = "./files/carts.json";
  }

  getCarts = async (logCarts) => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.path)) {
        const cartsData = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([cartsData]).size;
        if (size > 0) {
          const parsedCarts = JSON.parse(cartsData);
          if (logCarts === "log") {
            console.table(parsedCarts);
          }
          return parsedCarts;
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

  getCartById = async (cartId) => {
    try {
      const carts = await this.getCarts();
      const filteredCart = await carts.filter((cart) => cart.id === parseInt(cartId));
      return filteredCart;
    } catch (error) {
      console.log(error);
    }
  };

  createCart = async () => {
    try {
      const newCart = {
        id: 0,
        products: [],
      };

      const carts = await this.getCarts();

      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts.length - 1].id + 1);

      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };

  addToCart = async (cartId, productId) => {
    try {
      const productToAdd = {
        id: parseInt(productId),
        quantity: 1,
      };

      const carts = await this.getCarts();

      const cartIdFound = carts.findIndex((cart) => cart.id === parseInt(cartId));
      const productIdFound = carts[cartIdFound].products.findIndex((prod) => prod.id === parseInt(productId))

      if (cartIdFound !== -1) {
        if ( productIdFound !== -1 ) {
          carts[cartIdFound].products[productIdFound].quantity++;
        } else {
          carts[cartIdFound].products.push(productToAdd);
        }
        await fs.promises.writeFile(this.path,JSON.stringify(carts, null, "\t"));
      } else {
        throw new Error(`Add: Carrito en ID ${cartId} NO EXISTE`);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
