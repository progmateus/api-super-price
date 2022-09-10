import { ICreatePriceDTO } from "@modules/prices/dtos/ICreatePriceDTO";
import { Price } from "@modules/prices/infra/typeorm/entities/Price";
import { IPricesRepository } from "../IPricesRepository";


class PricesRepositoryInMemory implements IPricesRepository {
    async findBySupermarketIdAndProductId(supermarket_id: string, product_id: string): Promise<Price> {
        const price = await this.prices.find(price => price.product_id === product_id && price.supermarket_id === supermarket_id);
        return price
    }

    prices: Price[] = []

    async create({
        product_id,
        supermarket_id,
        user_id,
        price,
    }: ICreatePriceDTO): Promise<Price> {
        const value = new Price();

        Object.assign(value, {
            product_id,
            supermarket_id,
            user_id,
            price,
        })

        this.prices.push(value);

        return value;
    }

    async findById(id: string): Promise<Price> {
        const price = this.prices.find(price => price.id === id)
        return price
    }
    async findBySupermarketId(supermarket_id: string): Promise<Price[]> {
        const prices = this.prices.filter(price => price.supermarket_id === supermarket_id)
        return prices
    }
    async findByProductId(product_id: string): Promise<Price[]> {
        const prices = this.prices.filter(price => price.product_id === product_id)
        return prices
    }
    async findByUserId(user_id: string): Promise<Price[]> {
        const prices = this.prices.filter(price => price.user_id === user_id)
        return prices
    }
    async findPrice(supermarket_id?: string, product_id?: string): Promise<Price[]> {

        if (supermarket_id && !product_id) {
            const prices = await this.prices.filter(price => price.supermarket_id === supermarket_id);
            return prices
        }

        if (product_id && !supermarket_id) {
            const prices = await this.prices.filter(price => price.product_id === product_id);
            return prices
        }

        if (product_id && supermarket_id) {
            const prices = await this.prices.filter(price => price.product_id === product_id && price.supermarket_id === supermarket_id);
            return prices
        }

        return null;

    }

    async delete(id: string): Promise<void> {
        const price = this.prices.findIndex(product => product.id === id)
        await this.prices.splice(price)
    }

}
export { PricesRepositoryInMemory };