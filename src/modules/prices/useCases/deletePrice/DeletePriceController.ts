import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletePriceUseCase } from "./DeletePriceUseCase";

class DeletePriceController {
    async handle(request: Request, response: Response): Promise<Response> {

        const { id } = request.params;

        const deletePriceUseCase = container.resolve(DeletePriceUseCase)

        await deletePriceUseCase.execute(id);

        return response.status(204).json({ message: "Deleted" });
    }
}

export { DeletePriceController }