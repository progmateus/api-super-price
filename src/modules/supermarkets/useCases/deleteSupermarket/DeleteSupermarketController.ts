import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteSupermarketUseCase } from "./DeleteSupermarketUseCase";

class DeleteSupermarketController {
    async handle(request: Request, response: Response) {
        const { id } = request.params

        const deleteSupermarketUseCase = container.resolve(DeleteSupermarketUseCase)

        await deleteSupermarketUseCase.execute(id)

        return response.status(204).json({ message: "Deleted" });


    }
}
export { DeleteSupermarketController };