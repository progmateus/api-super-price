import { ICreateSupermarketDTO } from "@modules/supermarkets/dtos/ICreateSupermarketDTO";
import { Supermarket } from "@modules/supermarkets/infra/typeorm/entities/Supermarket";
import { ISupermarketsRepository } from "../ISupermarketsRepository";



class SupermarketsRepositoryInMemory implements ISupermarketsRepository {
    supermarkets: Supermarket[] = [];

    async create({ name }: ICreateSupermarketDTO): Promise<Supermarket> {
        const supermarket = new Supermarket();

        Object.assign(supermarket, {
            name
        })

        this.supermarkets.push(supermarket);

        return supermarket;

    }

    async findById(id: string): Promise<Supermarket> {
        const supermarket = await this.supermarkets.find((supermarket => supermarket.id === id))
        return supermarket;
    }

    async findByName(name: string): Promise<Supermarket> {
        const supermarket = await this.supermarkets.find((supermarket => supermarket.name === name));
        return supermarket;
    }

    async list(): Promise<Supermarket[]> {
        const supermarket = await this.supermarkets;
        return supermarket;
    }

    async delete(id: string): Promise<void> {
        const product = this.supermarkets.findIndex(product => product.id === id)
        await this.supermarkets.splice(product)
    }


}
export { SupermarketsRepositoryInMemory };