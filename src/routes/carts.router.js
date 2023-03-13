import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const cartManager = new CartManager();
const productManager = new ProductManager();
const router = Router();

/////////////////////////
///////GET METHODS///////
/////////////////////////

router.get("/:cid", async (req, res) => {
  let cid = req.params.cid;
  const filteredCart = await cartManager.getCartById(cid);

  if (isNaN(cid) || cid <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Item ${cid} es invalido el valor` },
    });
  }

  if (filteredCart == 0) {
    return res.status(404).send({
      status: "error",
      message: { error: `El item ID ${cid} No existe` },
    });
  }

  return res.status(200).send({
    status: "success",
    message: { cart: filteredCart },
  });
});

/////////////////////////
///////POST METHODS//////
/////////////////////////

router.post("/", async (req, res) => {

  await cartManager.createCart()

  return res.status(201).send({
    status: "success",
    message: {
      success: "Nuevo Item fue creado.",
    },
  });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const carts = await cartManager.getCarts();
  const cartIdFound = carts.findIndex((cart) => cart.id === parseInt(cartId));

  const products = await productManager.getProducts();
  const productIdFound = products.findIndex((prod) => prod.id === parseInt(productId));

  if (cartIdFound === -1) {
    return res.status(400).send({
      status: "error",
      message: { error: `El item id ${cartId} no existe` },
    });
  }

  if (productIdFound === -1) {
    return res.status(400).send({
      status: "error",
      message: { error: `El Producto id ${productId} no existe` },
    });
  }

  if (isNaN(cartId) || cartId <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Carrito id ${cartId} No existe el valor` },
    });
  }

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Carrito id ${productId} Tiene un valor invalido` },
    });
  }

  await cartManager.addToCart(cartId,productId)

  return res.status(201).send({
    status: "success",
    message: {
      success: `Producto agregado exitosamente con ID ${productId} al carrito con ID ${cartId}`,
    },
  });
});

export default router;