import { AppError } from "@errors/AppError";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { removeAccent } from "@utils/removeAccents";
import { inject, injectable } from "tsyringe";

@injectable()
class FindProductByNameUseCase {

    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) { }

    async execute(name: string): Promise<Product[]> {


        if (name.length > 100) {
            throw new AppError("Character limit exceeded", 400)
        }
        const nameWithowtAccents = removeAccent(name.toLocaleLowerCase())

        const products = await this.productsRepository.findByName(nameWithowtAccents);


        return products;
    }
}
export { FindProductByNameUseCase };