import { CreateSupermarketController } from "@modules/supermarkets/useCases/CreateSupermarket/CreateSupermarketController";
import { DeleteSupermarketController } from "@modules/supermarkets/useCases/deleteSupermarket/DeleteSupermarketController";
import { FindSupermarketByNameController } from "@modules/supermarkets/useCases/findSupermarketByName/FindSupermarketByNameController";
import { ListSupermarketsController } from "@modules/supermarkets/useCases/listSupermarkets/ListSupermarketsController";
import { Router } from "express";
import { EnsureAdmin } from "../middlewares/EnsureAdmin";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const supermarketsRoutes = Router();
const createSupermarketController = new CreateSupermarketController();
const listSupermarketsController = new ListSupermarketsController();
const findSupermarketByNameController = new FindSupermarketByNameController();
const deleteSupermarketController = new DeleteSupermarketController();


supermarketsRoutes.post("/", ensureAuthenticated, createSupermarketController.handle)
supermarketsRoutes.get("/", ensureAuthenticated, listSupermarketsController.handle);
supermarketsRoutes.get("/name/", ensureAuthenticated, findSupermarketByNameController.handle);
supermarketsRoutes.delete("/:id", ensureAuthenticated, EnsureAdmin, deleteSupermarketController.handle);



export { supermarketsRoutes };