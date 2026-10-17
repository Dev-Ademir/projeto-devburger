import { Router } from "express";
import UserController from "./app/controller/User.Controller.js";
import SessionController from "./app/controller/Session.Controller.js";
import ProductsController from "./app/controller/Products.Controller.js";
import multer from "multer";
import multerConfig from "./config/multer.js";
import authMiddleware from "./app/middleware/auth.js";
import CategoryController from "./app/controller/Category.Controller.js";
import adminMiddleware from "./app/middleware/admin.js";
import OrderController from "./app/controller/Order.Controller.js";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store),
routes.post("/session", SessionController.store),

routes.use(authMiddleware)
routes.post("/products", adminMiddleware, upload.single("file"), ProductsController.store);
routes.put("/products/:id", adminMiddleware, upload.single("file"), ProductsController.update);
routes.get("/products", ProductsController.index);

routes.post("/category", adminMiddleware, upload.single("file"), CategoryController.store);
routes.put("/category/:id", adminMiddleware, upload.single("file"), CategoryController.update);
routes.get("/category", CategoryController.index);

routes.post("/orders", OrderController.store);
routes.get("/orders", OrderController.index);
routes.put("/orders/:id", adminMiddleware, OrderController.update);

export default routes;