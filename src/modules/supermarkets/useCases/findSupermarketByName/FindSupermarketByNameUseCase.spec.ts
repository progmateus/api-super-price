import { SupermarketsRepositoryInMemory } from "@modules/supermarkets/repositories/in-memory/SupermarketsRepositoryInMemory";
import { FindSupermarketByNameUseCase } from "./FindSupermarketByNameUseCase";

let findSupermarketByNameUseCase: FindSupermarketByNameUseCase;
let supermarketsRepositoryInMemory: SupermarketsRepositoryInMemory;

describe("Find supermarket by name useCase", () => {
    beforeEach(() => {
        supermarketsRepositoryInMemory = new SupermarketsRepositoryInMemory();
        findSupermarketByNameUseCase = new FindSupermarketByNameUseCase(supermarketsRepositoryInMemory)
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