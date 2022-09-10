import { Request, Response } from "express"
import { container } from "tsyringe"
import { DeleteProductUseCase } from "./DeleteProductUseCase"

class DeleteProductController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        const deleteProductUseCase = container.resolve(DeleteProductUseCase)

        await deleteProductUseCase.execute(id);

        return response.status(204).json({ message: "Deleted" });
    }
}
export { DeleteProductController };