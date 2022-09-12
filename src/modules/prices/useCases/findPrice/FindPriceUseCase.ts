import { AppError } from "@errors/AppError";
import { IPricesRepository } from "@modules/prices/repositories/IPricesRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { inject, injectable } from "tsyringe";

interface IRequest {
    supermarket_name?: string;
    gtin?: string;
}
@injectable()
class FindPriceUseCase {

    constructor(
        @inject("PricesRepository")
        private pricesRepository: IPricesRepository,

        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,

        @inject("SupermarketsRepository")
        private supermarketsRepository: ISupermarketsRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider
    ) { }

    async execute({ supermarket_name, gtin }: IRequest) {

        if (gtin?.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (supermarket_name?.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        var product_id = null;
        var supermarket_id = null;


        if (gtin) {

            const isValidGtin = await this.validateProvider.validateGtin(gtin);


            if (isValidGtin === false) {
                throw new AppError("Invalid Gtin!", 400);
            }


            const product = await this.productsRepository.findByGtin(gtin);

            if (!product) {
                throw new AppError("Product not found!", 404)
            }


            product_id = product.id;
        }


        if (supermarket_name) {
            const supermarket = await this.supermarketsRepository.findByName(supermarket_name.toLocaleLowerCase());

            if (!supermarket) {
                /// throw new AppError("Supermarket not found!", 404)
                return ([])
            }

            supermarket_id = supermarket.id;
        }

        const prices = await this.pricesRepository.findPrice(
            supermarket_id,
            product_id
        )

        const pricesResponse = [];

        for (var i = 0; i < prices.length; i++) {

            const mapPrice = await this.pricesRepository.findById(prices[i].id)
            const mapProduct = await this.productsRepository.findById(prices[i].product_id)
            const mapSupermarket = await this.supermarketsRepository.findById(prices[i].supermarket_id)

            const priceResponse = {
                product: {
                    id: mapProduct.id,
                    name: mapProduct.name,
                    gtin: mapProduct.gtin,
                    brand: mapProduct.brand,
                    thumbnail: mapProduct.thumbnail
                },

                price: {
                    id: mapPrice.id,
                    price: mapPrice.price,
                    user_id: mapPrice.user_id,
                    created_at: mapPrice.created_at,
                    updated_at: mapPrice.updated_at,
                },

                supermarket: {
                    id: mapPrice.supermarket_id,
                    name: mapSupermarket.name
                }
            }

            pricesResponse.push(priceResponse);

        }
        return pricesResponse;

    }

}
export { FindPriceUseCase };