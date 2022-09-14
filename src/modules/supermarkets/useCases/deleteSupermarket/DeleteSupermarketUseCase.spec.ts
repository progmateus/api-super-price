import { SupermarketsRepository } from "@modules/supermarkets/infra/typeorm/repositories/SupermarketsRepository";
import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { DeleteSupermarketUseCase } from "./DeleteSupermarketUseCase";
import { v4 as uuidV4 } from "uuid";
import { AppError } from "@errors/AppError";




let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;
let deleteSupermarketUseCase: DeleteSupermarketUseCase;
let validateProvider: IValidateProvider;

describe("Delete a Supermarket", () => {

    beforeEach(() => {
        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory();
        validateProvider = new ValidateProvider();

        deleteSupermarketUseCase = new DeleteSupermarketUseCase(
            supermarketsRepositoryInMemory,
            validateProvider
        );
    })


    it("Should be able to delete a Supermarket", async () => {
        const supermarket = {
            name: "supermarket test",
        }

        const supermarketCreated = await supermarketsRepositoryInMemory.create({ name: supermarket.name });

        await deleteSupermarketUseCase.execute(supermarketCreated.id)

        const supermarketAlreadyExists = await supermarketsRepositoryInMemory.findById(supermarketCreated.id);

        expect(supermarketAlreadyExists).toEqual(undefined);
    })

    it("should not be able to delete a non-existing Supermarket", async () => {

        const randomId = uuidV4();

        expect(async () => {
            await deleteSupermarketUseCase.execute(randomId)

        }).rejects.toEqual(new AppError("Supermarket not found", 404))
    })

})