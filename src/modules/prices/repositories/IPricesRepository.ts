import { ICreatePriceDTO } from "../dtos/ICreatePriceDTO"
import { Price } from "../infra/typeorm/entities/Price";

interface IPricesRepository {

    create(data: ICreatePriceDTO): Promise<Price>;
    findById(id: string): Promise<Price>;
    findBySupermarketId(supermarket_id: string): Promise<Price[]>;
    findBySupermarketIdAndProductId(supermarket_id: string, product_id: string): Promise<Price>
    findByProductId(product_id: string): Promise<Price[]>;
    findByUserId(user_id: string): Promise<Price[]>
    findPrice(supermarket_id?: string, product_id?: string): Promise<Price[]>;
    delete(id: string): Promise<void>;
}

export { IPricesRepository }