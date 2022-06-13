import { AppError } from "@errors/AppError";
import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";


@injectable()
class CreateProductUseCase {

    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }


    async execute({
        name,
        gtin,
        brand = "Não informado",
        thumbnail,
    }: ICreateProductDTO): Promise<Product> {


        if (gtin.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        const isValidGtin = this.validateProvider.validateGtin(gtin);

        if (isValidGtin === false) {
            throw new AppError("Invalid Gtin", 400)
        }

        const product = await this.productsRepository.findByGtin(gtin)

        if (product) {
            throw new AppError("Product already exists!", 409)
        }


        const productCreated = await this.productsRepository.create({
            name: name.toLowerCase(),
            gtin,
            brand: brand.toLowerCase(),
            thumbnail,
        });

        return productCreated;

    }

}
export { CreateProductUseCase }