import { AppError } from "@errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Price } from "@modules/prices/infra/typeorm/entities/Price";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { FindProductByGtinUseCase } from "@modules/products/useCases/findProductByGtin/FindProductByGtinUseCase";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { CreateSupermarketUseCase } from "@modules/supermarkets/useCases/CreateSupermarket/CreateSupermarketUseCase";
import { IValidateProvider } from "@shared/container/providers/ValidateProvider/IValidateProvider";
import { container, inject, injectable } from "tsyringe";
import { ICreatePriceDTO } from "../../dtos/ICreatePriceDTO";
import { IPricesRepository } from "../../repositories/IPricesRepository";

@injectable()
class CreatePriceUseCase {

    constructor(
        @inject("PricesRepository")
        private pricesRepository: IPricesRepository,

        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("SupermarketsRepository")
        private supermarketsRepository: ISupermarketsRepository,

        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,

        @inject("ValidateProvider")
        private validateProvider: IValidateProvider


    ) { }

    async execute({
        gtin,
        supermarket_name,
        user_id,
        price
    }): Promise<Price> {


        if (await this.validateProvider.uuidValidateV4(user_id) === false) {
            throw new AppError("Invalid user uuid")
        }

        if (gtin.length > 50) {
            throw new AppError("Character limit exceeded", 400)
        }

        if (supermarket_name.length > 100) {
            throw new AppError("Character limit exceeded", 400)
        }


        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError("User does not exists", 404);
        }

        const isValidGtin = await this.validateProvider.validateGtin(gtin);

        if (isValidGtin === false) {
            throw new AppError("Invalid Gtin", 400)
        }

        const product = await this.productsRepository.findByGtin(gtin)

        if (!product) {
            throw new AppError("Product not found", 404)
        }

        const supermarketLowerCase = supermarket_name.toLowerCase()

        let supermarket = await this.supermarketsRepository.findByName(supermarketLowerCase);

        if (!supermarket) {

            supermarket = await this.supermarketsRepository.create(supermarketLowerCase)
        }


        if (typeof price !== "number") {
            throw new AppError("Invalid price!", 400)
        }

        const priceAlreadyExists = await this.pricesRepository.findBySupermarketIdAndProductId(
            supermarket.id,
            product.id
        );

        if (priceAlreadyExists) {
            throw new AppError("Price already exists!", 409)
        }

        const priceFormatted = Number(price.toFixed(2));

        const priceCreated = await this.pricesRepository.create({
            product_id: product.id,
            supermarket_id: supermarket.id,
            user_id,
            price: priceFormatted
        })

        return priceCreated;
    }
}
export { CreatePriceUseCase }