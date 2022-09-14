import { AppError } from "@errors/AppError";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";
import { CannotExecuteNotConnectedError } from "typeorm"

@injectable()
class DeleteProductUseCase {

    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute(id: string) {

        if (id.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        const isValidUuidV4 = await this.validateProvider.uuidValidateV4(id)

        if (!isValidUuidV4) {
            throw new AppError("Invalid uuid", 400)
        }

        const product = await this.productsRepository.findById(id);

        if (!product) {
            throw new AppError("Product not found", 404)
        }

        await this.productsRepository.delete(id)
    }

}

export { DeleteProductUseCase };