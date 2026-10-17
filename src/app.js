import express from "express";
import Database from "./database/index.js";
import routes from "./routes.js";
import fileRouteConfig from "./config/fileRoutes.cjs"

new Database();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/product-file", fileRouteConfig);
app.use("/category-file", fileRouteConfig);

app.use(routes);

export default app;