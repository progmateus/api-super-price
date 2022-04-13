import { CreateProductController } from "@modules/products/useCases/CreateProduct/CreateProductController";
import { FindProductByGtinController } from "@modules/products/useCases/findProductByGtin/FindProductByGtinController";
import { LitsProductsController } from "@modules/products/useCases/listProducts/ListProductsController";
import { Router } from "express";
import { EnsureAdmin } from "../middlewares/EnsureAdmin";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const productsRoutes = Router();

const createProductController = new CreateProductController();
const litsProductsController = new LitsProductsController();
const findProductByGtinController = new FindProductByGtinController()


productsRoutes.post("/", ensureAuthenticated, EnsureAdmin, createProductController.handle);
productsRoutes.get("/", ensureAuthenticated, litsProductsController.handle);
productsRoutes.get("/:gtin", ensureAuthenticated, findProductByGtinController.handle);


export { productsRoutes };