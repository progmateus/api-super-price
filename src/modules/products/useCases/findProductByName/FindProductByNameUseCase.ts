import { AppError } from "@errors/AppError";
import { Product } from "@modules/products/infra/typeorm/entities/Product";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { container, inject, injectable } from "tsyringe";
import { CreateProductUseCase } from "../createProduct/CreateProductUseCase";

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

        const products = await this.productsRepository.findByName(name.toLocaleLowerCase());


        return products;
    }
}
export { FindProductByNameUseCase };