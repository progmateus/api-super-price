import { AppError } from "@errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ISupermarketsRepository } from "@modules/supermarkets/repositories/ISupermarketsRepository";
import { inject, injectable } from "tsyringe";
import { ICreatePriceDTO } from "../dtos/ICreatePriceDTO";
import { IPricesRepository } from "../repositories/IPricesRepository";

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


    ) { }

    async execute({
        id,
        product_id,
        supermarket_id,
        user_id,
        price
    }: ICreatePriceDTO): Promise<void> {


        const product = await this.productsRepository.findById(product_id);
        if (!product) {
            throw new AppError("Product does not exists");
        }

        const supermarket = await this.supermarketsRepository.findById(supermarket_id);
        if (!supermarket) {
            throw new AppError("Supermarket does not exists");
        }

        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new AppError("User does not exists");
        }

        await this.pricesRepository.create({
            id,
            product_id,
            supermarket_id,
            user_id,
            price
        })
    }
}
export { CreatePriceUseCase }