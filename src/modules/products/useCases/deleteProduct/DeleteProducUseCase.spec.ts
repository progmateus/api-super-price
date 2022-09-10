import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { CreateProductUseCase } from "../createProduct/CreateProductUseCase";
import { DeleteProductUseCase } from "./DeleteProductUseCase";
import { v4 as uuidV4 } from "uuid";
import { AppError } from "@errors/AppError";




let productsRepositoryInMemory: ProductsRepositoryInMemory;
let deleteProductUseCase: DeleteProductUseCase;
let validateProvider: IValidateProvider;




describe("Delete a Product", () => {

    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        validateProvider = new ValidateProvider();

        deleteProductUseCase = new DeleteProductUseCase(
            productsRepositoryInMemory,
            validateProvider
        );
    })


    it("Should be able to delete a Product", async () => {
        const product = {
            name: "name test",
            gtin: "7898940123025",
            brand: "brand test",
            thumbnail: "link image test",
        }

        const productCreated = await productsRepositoryInMemory.create(product);

        await deleteProductUseCase.execute(productCreated.id)

        const products = await productsRepositoryInMemory.list();

        expect(products.length).toEqual(0);
    })

    it("should not be able to delete a non-existing product", async () => {

        const randomId = uuidV4();

        expect(async () => {
            await deleteProductUseCase.execute(randomId)

        }).rejects.toEqual(new AppError("Product not found", 404))
    })

})