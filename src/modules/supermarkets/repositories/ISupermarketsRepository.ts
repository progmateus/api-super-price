import { ICreateSupermarketDTO } from "../dtos/ICreateSupermarketDTO"
import { Supermarket } from "../infra/typeorm/entities/Supermarket";

interface ISupermarketsRepository {

    create(name: string): Promise<Supermarket>;
    findById(id: string): Promise<Supermarket>;
    findByName(name: string): Promise<Supermarket>;
    list(): Promise<Supermarket[]>;
    delete(id: string): Promise<void>;
}
export { ISupermarketsRepository }