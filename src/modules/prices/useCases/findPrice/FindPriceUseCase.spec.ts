import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { PricesRepositoryInMemory } from "@modules/prices/repositories/in-memory/PricesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { FindPriceUseCase } from "./FindPriceUseCase";


let pricesRepositoryInMemory: PricesRepositoryInMemory;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;
let validateProvider: ValidateProvider;
let findPriceUseCase: FindPriceUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;



describe("Find prices useCase", () => {
    beforeEach(() => {
        pricesRepositoryInMemory = new PricesRepositoryInMemory()
        productsRepositoryInMemory = new ProductsRepositoryInMemory()
        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory()
        validateProvider = new ValidateProvider();
        findPriceUseCase = new FindPriceUseCase(
            pricesRepositoryInMemory,
            productsRepositoryInMemory,
            supermarketsRepositoryInMemory,
            validateProvider
        )
        usersRepositoryInMemory = new UsersRepositoryInMemory();
    })


    it("Should be able to find a Price", async () => {

        const product = await productsRepositoryInMemory.create({
            name: "product test",
            gtin: "7898940123025",
            brand: "brand test",
            thumbnail: "link image test",
        })

        const supermarket = await supermarketsRepositoryInMemory.create({
            name: "supermarket test"
        })

        const user = await usersRepositoryInMemory.create({
            name: "John",
            lastname: "Doe",
            email: "johndoe@gmail.com",
            password: "john123",
        })

        const userCreated = await usersRepositoryInMemory.findByEmail("johndoe@gmail.com")

        const priceCreated = await pricesRepositoryInMemory.create({
            product_id: product.id,
            supermarket_id: supermarket.id,
            user_id: userCreated.id,
            price: 4.0
        })

        const prices = await findPriceUseCase.execute({
            supermarket_name: supermarket.name,
            gtin: product.gtin
        });

        expect(prices.length).toEqual(1);
    })
})