import { AppError } from "@errors/AppError";
import { ICreateSupermarketDTO } from "@modules/supermarkets/dtos/ICreateSupermarketDTO";
import { Supermarket } from "@modules/supermarkets/infra/typeorm/entities/Supermarket";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";


@injectable()
class CreateSupermarketUseCase {

    constructor(
        @inject("SupermarketsRepository")
        private supermarketsRepository: ISupermarketsRepository,
        @inject("ValidateProvider")
        private validateProvider: IValidateProvider

    ) { }

    async execute({
        name,
    }: ICreateSupermarketDTO): Promise<Supermarket> {

        if (name.length > 100) {
            throw new AppError("Character limit exceeded", 400)
        }

        const nameLowerCase = name.toLowerCase();

        const isInvalidSupermarketName = await this.validateProvider.validateSupermarketName(nameLowerCase)

        if (isInvalidSupermarketName === true) {
            throw new AppError("Invalid supermarket name", 400)
        }

        const supermarket = await this.supermarketsRepository.findByName(nameLowerCase);

        if (supermarket) {
            throw new AppError("Supermarket already exists!", 409);
        }

        const supermarketCreated = await this.supermarketsRepository.create({
            name: nameLowerCase
        })

        return supermarketCreated;
    }

}
export { CreateSupermarketUseCase }