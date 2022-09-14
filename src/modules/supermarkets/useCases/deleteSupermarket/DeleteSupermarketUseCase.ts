import { AppError } from "@errors/AppError";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";
import { isConstructorDeclaration } from "typescript";

@injectable()
class DeleteSupermarketUseCase {

    constructor(
        @inject("SupermarketsRepository")
        private supermarketsRepository: ISupermarketsRepository,
        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute(id: string) {


        if (id.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        const isValidUuid = await this.validateProvider.uuidValidateV4(id);

        if (isValidUuid === false) {
            throw new AppError("Invalid uuid", 400)
        }


        const supermarket = await this.supermarketsRepository.findById(id)

        if (!supermarket) {
            throw new AppError("Supermarket not found", 404)
        }

        await this.supermarketsRepository.delete(id);

    }

}

export { DeleteSupermarketUseCase }