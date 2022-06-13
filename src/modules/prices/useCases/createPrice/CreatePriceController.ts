import { Request, Response } from "express"
import { container } from "tsyringe";
import { CreatePriceUseCase } from "./CreatePriceUseCase";


class CreatePriceController {

    async handle(request: Request, response: Response): Promise<Response> {
        const {
            gtin,
            supermarket_name,
            price } = request.body;

        const { id } = request.user;



        const createPriceUseCase = container.resolve(CreatePriceUseCase);

        const priceCreated = await createPriceUseCase.execute({
            gtin,
            supermarket_name,
            user_id: id,
            price
        })

        return response.status(201).json(priceCreated);
    }
}
export { CreatePriceController }