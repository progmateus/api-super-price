import { AppError } from "@errors/AppError";
import { IPricesRepository } from "@modules/prices/repositories/IPricesRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";

@injectable()
class DeletePriceUseCase {

    constructor(
        @inject("PricesRepository")
        private pricesRepository: IPricesRepository,
        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute(id: string): Promise<void> {

        if (id.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        const isValidUuidV4 = await this.validateProvider.uuidValidateV4(id);

        if (!isValidUuidV4) {
            throw new AppError("Invalid uuid", 400)
        }

        const price = await this.pricesRepository.findById(id);

        if (!price) {
            throw new AppError("Price not found", 404)
        }

        await this.pricesRepository.delete(price.id);

    }

}
export { DeletePriceUseCase };