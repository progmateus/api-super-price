import { CreateProductController } from "@modules/products/useCases/CreateProduct/CreateProductController";
import { DeleteProductController } from "@modules/products/useCases/deleteProduct/DeleteProductController";
import { FindProductByGtinController } from "@modules/products/useCases/findProductByGtin/FindProductByGtinController";
import { FindProductByNameController } from "@modules/products/useCases/findProductByName/FindProductByNameController";
import { LitsProductsController } from "@modules/products/useCases/listProducts/ListProductsController";
import { Router } from "express";
import { EnsureAdmin } from "../middlewares/EnsureAdmin";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const productsRoutes = Router();

const createProductController = new CreateProductController();
const litsProductsController = new LitsProductsController();
const findProductByGtinController = new FindProductByGtinController()
const findProductByNameController = new FindProductByNameController();
const deleteProductController = new DeleteProductController();


productsRoutes.post("/", ensureAuthenticated, EnsureAdmin, createProductController.handle);
productsRoutes.get("/", ensureAuthenticated, litsProductsController.handle);
productsRoutes.get("/name/", ensureAuthenticated, findProductByNameController.handle);
productsRoutes.get("/:gtin", ensureAuthenticated, findProductByGtinController.handle);
productsRoutes.delete("/:gtin", ensureAuthenticated, EnsureAdmin, deleteProductController.handle);



export { productsRoutes };