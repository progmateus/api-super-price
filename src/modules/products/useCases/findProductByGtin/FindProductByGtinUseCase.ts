import { AppError } from "@errors/AppError";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { getProductByGtin } from "@services/api";
import { container, inject, injectable } from "tsyringe";
import { CreateProductUseCase } from "../CreateProduct/CreateProductUseCase";


@injectable()
class FindProductByGtinUseCase {

    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute(gtin: string) {

        if (gtin.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        const isValidGtin = await this.validateProvider.validateGtin(gtin);

        if (isValidGtin === false) {
            throw new AppError("Invalid Gtin", 400)
        }

        let product = await this.productsRepository.findByGtin(gtin);

        if (!product) {
            const getProduct = await getProductByGtin(gtin);

            switch (getProduct.status) {
                case 200:
                    const createProductUseCase = container.resolve(CreateProductUseCase);

                    product = await createProductUseCase.execute({
                        name: getProduct.data.description,
                        brand: getProduct.data.brand?.name,
                        gtin: getProduct.data.gtin,
                        thumbnail: getProduct.data.thumbnail
                    });

                    break;

                case 404:
                    throw new AppError("Product not found", 404)
                default:
                    throw new AppError("Internal server error", 500)
            }
        }
        return product;
    }

}
export { FindProductByGtinUseCase }