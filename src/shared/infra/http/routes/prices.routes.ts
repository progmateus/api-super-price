import { CreatePriceController } from "@modules/prices/useCases/createPrice/CreatePriceController";
import { DeletePriceController } from "@modules/prices/useCases/deletePrice/DeletePriceController";
import { FindPriceController } from "@modules/prices/useCases/findPrice/FindPriceController";
import { UpdatePriceController } from "@modules/prices/useCases/updatePrice/UpdatePriceController";
import { Router } from "express";
import { EnsureAdmin } from "../middlewares/EnsureAdmin";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated";

const pricesRoutes = Router();
const createPriceController = new CreatePriceController();
const findPriceController = new FindPriceController();
const updatePriceController = new UpdatePriceController();
const deletePriceController = new DeletePriceController();


pricesRoutes.post("/", ensureAuthenticated, createPriceController.handle);
pricesRoutes.patch("/", ensureAuthenticated, updatePriceController.handle)
pricesRoutes.get("/", ensureAuthenticated, findPriceController.handle);
pricesRoutes.delete("/:id", ensureAuthenticated, EnsureAdmin, deletePriceController.handle)


export { pricesRoutes };