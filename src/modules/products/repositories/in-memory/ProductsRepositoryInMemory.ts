import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { Product } from "../../infra/typeorm/entities/Product";

class ProductsRepositoryInMemory implements IProductsRepository {

    products: Product[] = [];


    async create({
        name,
        gtin,
        brand,
        thumbnail
    }: ICreateProductDTO): Promise<Product> {
        const product = new Product();

        Object.assign(product, {
            name,
            gtin,
            brand,
            thumbnail
        })

        this.products.push(product)

        return product
    }
    async findById(id: string): Promise<Product> {
        const product = this.products.find(product => product.id === id)
        return product
    }
    async findByGtin(gtin: string): Promise<Product> {
        const product = this.products.find(product => product.gtin === gtin)
        return product
    }
    async list(): Promise<Product[]> {
        const products = await this.products;
        return products;
    }

    async findByName(name: string): Promise<Product[]> {
        const products = this.products.filter(product => product.name === name)
        return products
    }
    async delete(id: string): Promise<void> {
        const product = this.products.findIndex(product => product.id === id)
        await this.products.splice(product)
    }

}
export { ProductsRepositoryInMemory };