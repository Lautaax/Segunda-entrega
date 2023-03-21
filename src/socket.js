import { Server } from "socket.io";
import ProductManager from "./productManager.js";
const socket = {};

socket.connect = (server) => {
  const productManager = new ProductManager();
  socket.io = new Server(server);

  socket.io.on("connection", async (socket) => {
    console.log(`Socket ${socket.id} is online!`);
    const products = await productManager.getProducts();
    socket.emit("products", products);
  });
};

export default socket;
