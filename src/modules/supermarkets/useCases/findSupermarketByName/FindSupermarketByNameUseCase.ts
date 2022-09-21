import { AppError } from "@errors/AppError";
import { Supermarket } from "@modules/supermarkets/infra/typeorm/entities/Supermarket";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { ValidateProvider } from "@shared/container/providers/ValidateProvider/implementations/ValidateProvider";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";


@injectable()
class FindSupermarketByNameUseCase {

    constructor(
        @inject("SupermarketsRepository")
        private supermarketsRepository: ISupermarketsRepository,
        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute(name: string): Promise<Supermarket> {

        if (name.length > 80) {
            throw new AppError("Character limit exceeded", 400)
        }

        const nameLowerCase = name.toLowerCase();

        const isInvalidSupermarketName = await this.validateProvider.validateSupermarketName(nameLowerCase)

        if (isInvalidSupermarketName === true) {
            throw new AppError("Invalid supermarket name", 400)
        }

        const supermarket = await this.supermarketsRepository.findByName(nameLowerCase);

        if (!supermarket) {
            throw new AppError("Supermarket not found!", 404);
        }

        return supermarket
    }
}
export { FindSupermarketByNameUseCase }