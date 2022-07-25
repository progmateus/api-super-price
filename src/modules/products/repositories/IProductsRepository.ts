import { ICreateProductDTO } from "../dtos/ICreateProductDTO";
import { Product } from "../infra/typeorm/entities/Product";

interface IProductsRepository {

    create(data: ICreateProductDTO): Promise<Product>;
    findById(id: string): Promise<Product>;
    findByGtin(gtin: string): Promise<Product>;
    findByName(name: string): Promise<Product[]>;
    list(): Promise<Product[]>;
    delete(id: string): Promise<void>;
}
export { IProductsRepository };