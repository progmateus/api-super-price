import { AppError } from "@errors/AppError";
import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { validate } from "uuid";
import { CreateSupermarketUseCase } from "./CreateSupermarketUseCase";



let createSupermarketUseCase: CreateSupermarketUseCase;
let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;
let validateProvider: IValidateProvider;


describe("Create Supermarket", () => {
    beforeEach(() => {
        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory();
        validateProvider = new ValidateProvider();
        createSupermarketUseCase = new CreateSupermarketUseCase(
            supermarketsRepositoryInMemory,
            validateProvider
        )
    })


    it("Should be able to create a new Supermarket", async () => {
        const supermarket = {
            name: "Supermarket test"
        };

        const supermarketCreated = await createSupermarketUseCase.execute({
            name: supermarket.name
        })

        expect(supermarketCreated).toHaveProperty("id");
    });

    it("Should not be able to create a new Supermarket with same name", async () => {
        expect(async () => {
            const supermarket = {
                name: "Supermarket test"
            };

            await createSupermarketUseCase.execute({
                name: supermarket.name,
            })

            await createSupermarketUseCase.execute({
                name: supermarket.name,
            })
        }).rejects.toBeInstanceOf(AppError)
    })
})