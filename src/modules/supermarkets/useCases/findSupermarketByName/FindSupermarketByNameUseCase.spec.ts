import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { FindSupermarketByNameUseCase } from "./FindSupermarketByNameUseCase";

let findSupermarketByNameUseCase: FindSupermarketByNameUseCase;
let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;
let validateProvider: IValidateProvider;

describe("Find supermarket by name useCase", () => {
    beforeEach(() => {
        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory();
        validateProvider = new ValidateProvider();
        findSupermarketByNameUseCase = new FindSupermarketByNameUseCase(
            supermarketsRepositoryInMemory,
            validateProvider
        )
    })


    it("Should be able to find a Supermarket by name", async () => {
        const supermarket = {
            name: "Supermarket test"
        };

        const nameToLowerCase = supermarket.name.toLocaleLowerCase();

        await supermarketsRepositoryInMemory.create({
            name: nameToLowerCase
        })

        const supermarketCreated = await findSupermarketByNameUseCase.execute(
            supermarket.name
        );

        expect(supermarketCreated.name).toEqual(nameToLowerCase);

    })
});