import { ICreatePriceDTO } from "@modules/prices/dtos/ICreatePriceDTO";
import { IPricesRepository } from "@modules/prices/repositories/IPricesRepository";
import { getRepository, Repository } from "typeorm";
import { Price } from "../entities/Price";

class PricesRepository implements IPricesRepository {
    private repository: Repository<Price>

    constructor() {
        this.repository = getRepository(Price);
    }

    async findBySupermarketIdAndProductId(supermarket_id: string, product_id: string): Promise<Price> {
        /*  const priceQuery = this.repository.createQueryBuilder("p")
         priceQuery
             .where("supermarket_id = :supermarket_id", { supermarket_id })
             .andWhere("product_id = :product_id", { product_id })
 
         const price = await priceQuery.getOne(); */

        const price = this.repository.findOne({
            supermarket_id,
            product_id
        });

        return price;

    }


    async create({
        id,
        product_id,
        supermarket_id,
        user_id,
        price
    }: ICreatePriceDTO): Promise<Price> {
        const value = this.repository.create({
            id,
            product_id,
            supermarket_id,
            user_id,
            price
        })

        await this.repository.save(value);

        return value;
    }
    async findById(id: string): Promise<Price> {
        const price = await this.repository.findOne(id)
        return price
    }


    async findBySupermarketId(supermarket_id: string): Promise<Price[]> {
        const price = await this.repository.find({ supermarket_id })
        return price
    }


    async findByProductId(product_id: string): Promise<Price[]> {
        const price = await this.repository.find({ product_id })
        return price
    }


    async findByUserId(user_id: string): Promise<Price[]> {
        const price = await this.repository.find({ user_id })
        return price
    }


    async findPrice(supermarket_id?: string, product_id?: string): Promise<Price[]> {
        const pricesQuery = this.repository.createQueryBuilder("p")

        if (supermarket_id && product_id) {
            pricesQuery
                .where("supermarket_id = :supermarket_id", { supermarket_id })
                .andWhere("product_id = :product_id", { product_id })
        }

        if (supermarket_id && !product_id) {
            pricesQuery
                .where("supermarket_id = :supermarket_id", { supermarket_id })
        }

        if (product_id && !supermarket_id) {
            pricesQuery.where("product_id = :product_id", { product_id })
        }


        const prices = await pricesQuery.getMany();

        return prices;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

}
export { PricesRepository };