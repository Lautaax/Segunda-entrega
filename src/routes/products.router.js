import { Router } from "express";
import ProductManager from "../productManager.js";
import { uploader } from "../utils.js";

const productManager = new ProductManager();
const router = Router();

//GET

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  const limitedProducts = products.slice(0, limit);

  if (!products)
    return res.status(404).send({
      status: "error",
      message: { error: `No products found` },
    });

  if (!limit)
    return res.status(200).send({
      status: "success",
      message: { products: products },
    });

  if (isNaN(limit)) {
    return res.status(400).send({
      status: "error",
      message: { error: `Limit ${limit} is not a valid value` },
    });
  }

  return res.status(200).send({
    status: "success",
    message: { products: limitedProducts },
  });
});

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const filteredProduct = await productManager.getProductById(pid);

  if (isNaN(pid) || pid <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Product ID ${pid} is not a valid value` },
    });
  }

  if (!filteredProduct || filteredProduct == 0)
    return res.status(404).send({
      status: "error",
      message: { error: `Product with ID ${pid} was not found` },
    });

  return res.status(200).send({
    status: "success",
    message: { product: filteredProduct },
  });
});

//post

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  let newProduct = req.body;

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock ) {
    return res.status(400).send({
      status: "error",
      message: { error: "Todos los campos son obligatorios" },
    });
  }

  if (newProduct.id || newProduct.id == 0) {
    return res.status(400).send({
      status: "error",
      message: { error: "Producto sin ID Asignado" },
    });
  }

  if (req.files) newProduct.thumbnails = req.files;

  if (!req.files && !newProduct.thumbnails) {
    return res.status(400).send({
      status: "error",
      message: { error: `No se pudieron guardar las miniaturas` },
    });
  }

  const products = await productManager.getProducts()
  const productIndex = await products.findIndex((prod) => prod.code === newProduct.code);

  if (productIndex !== -1) {
    return res.status(400).send({
      status: "error",
      message: { error: `Producto con el codigo ${newProduct.code} ya existe` },
    });
  }

  newProduct = await productManager.addProduct(newProduct);

  return res.status(201).send({
    status: "success",
    message: {
      success: `Producto ${newProduct.title} Agregado correctamente`,
      id: `${newProduct.id}`,
    },
  });
});


//Metodo Put

router.put("/:pid", async (req, res) => {
  const updateProd = req.body;
  const updatePos = req.params.pid;
  
  if (!updateProd) {
    return res.status(400).send({
      status: "error",
      message: { error: "Valores incompletos" },
    });
  }
  
  if (isNaN(updatePos) || updatePos <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `${updatePos} Posicion invalida` },
    });
  }
  
  if (updateProd.id) {
    return res.status(400).send({
      status: "error",
      message: { error: "El ID del producto no se puede cambiar" },
    });
  }
  
  const prodUpdatePos = await productManager.updateProduct(updatePos, updateProd);

  if (prodUpdatePos === -1) {
    return res.status(404).send({
      status: "error",
      message: { error: `No se encontró ningún producto con ID ${updatePos}` },
    });
  }
  
  return res.status(200).send({
    status: "success",
    message: { update: `Producto con ID ${updatePos} se actualizó con éxito a ${updateProd.title}` },
  });
});

/////////////////////////
//////DELETE METHOD//////
/////////////////////////

router.delete("/:pid", async (req, res) => {
  const deleteID = req.params.pid;
  
  if (!deleteID) {
    return res.status(400).send({
      status: "error",
      message: { error: "Valores Incompletos" },
    });
  }
  
  if (isNaN(deleteID) || deleteID <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `${deleteID} Posicion invalida` },
    });
  }
  
  const prodDeletePos = await productManager.deleteProduct(deleteID);

  if (prodDeletePos === -1) {
    return res.status(404).send({
      status: "error",
      message: { error: `No se encontró ningún producto con ID ${deleteID}` },
    });
  }
  
  return res.status(200).send({
    status: "success",
    message: {
      delete: `Producto con ID ${deleteID} se elimino con exito`,
    },
  });
});

export default router;