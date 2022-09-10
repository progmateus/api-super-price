import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { PricesRepositoryInMemory } from "@modules/prices/repositories/in-memory/PricesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { DeletePriceUseCase } from "./DeletePriceUseCase";
import { v4 as uuidV4 } from "uuid";
import { AppError } from "@errors/AppError";




let pricesRepositoryInMemory: PricesRepositoryInMemory;
let validateProvider: ValidateProvider;
let deletePriceUseCase: DeletePriceUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;


describe("Delete a Price", () => {

    beforeEach(() => {
        pricesRepositoryInMemory = new PricesRepositoryInMemory();
        validateProvider = new ValidateProvider();

        deletePriceUseCase = new DeletePriceUseCase(
            pricesRepositoryInMemory,
            validateProvider
        );

        usersRepositoryInMemory = new UsersRepositoryInMemory();

        productsRepositoryInMemory = new ProductsRepositoryInMemory();

        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory();
    })


    it("Should be able to delete a Price", async () => {

        const user = await usersRepositoryInMemory.create({
            name: "John",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        })

        const userCreated = await usersRepositoryInMemory.findByEmail("johndoe@gmail.com")

        const product = await productsRepositoryInMemory.create({
            name: "name test",
            gtin: "7898940123025",
            brand: "brand test",
            thumbnail: "link image test",
        })

        const supermarket = await supermarketsRepositoryInMemory.create({
            name: "supermarket test"
        })

        const price = await pricesRepositoryInMemory.create({
            product_id: product.id,
            supermarket_id: supermarket.id,
            user_id: userCreated.id,
            price: 4.0
        })

        const priceCreated = await pricesRepositoryInMemory.findById(price.id)

        await deletePriceUseCase.execute(priceCreated.id)

        const prices = await pricesRepositoryInMemory.findPrice(
            supermarket.id,
            product.id,
        )

        expect(prices.length).toEqual(0);
    })

    it("should not be able to delete a non-existing product", async () => {

        const randomId = uuidV4();

        expect(async () => {
            await deletePriceUseCase.execute(randomId)

        }).rejects.toEqual(new AppError("Price not found", 404))
    })

})