import { getRepository, Repository } from "typeorm";
import { ICreateProductDTO } from "@modules/products/dtos/ICreateProductDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { Product } from "../entities/Product";

class ProductsRepository implements IProductsRepository {

    private repository: Repository<Product>

    constructor() {
        this.repository = getRepository(Product)
    }

    async create({
        id,
        name,
        gtin,
        brand,
        thumbnail,

    }: ICreateProductDTO): Promise<Product> {
        const product = this.repository.create({
            id,
            name,
            gtin,
            brand,
            thumbnail
        })

        await this.repository.save(product);

        return product
    }
    async findById(id: string): Promise<Product> {
        const product = await this.repository.findOne(id);
        return product;
    }
    async findByGtin(gtin: string): Promise<Product> {
        const product = await this.repository.findOne({ gtin })
        return product;
    }
    async findByName(name: string): Promise<Product[]> {
        const productsQuery = await this.repository.createQueryBuilder("products")

        productsQuery.where("name like :name", { name: `%${name}%` })
        const products = await productsQuery.getMany();

        return products;
    }

    async list(): Promise<Product[]> {
        const products = await this.repository.find();
        return products
    }
}
export { ProductsRepository };