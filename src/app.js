import express from "express";
import handlebars from "express-handlebars";
import socket from "./socket.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import __dirname from "./utils.js";

const env = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/", viewsRouter);

  app.engine("handlebars", handlebars.engine());
  app.set("view engine", "handlebars");
  app.set("views", __dirname + "/views");

  const httpServer = app.listen(8080, () =>
    console.log("Server up in port 8080!")
  );

  socket.connect(httpServer);
};

env();
