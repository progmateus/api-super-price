import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "@errors/AppError";

interface IPayload {
    sub: string
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token missing!");
    }

    if (authHeader.length > 350) {
        throw new AppError("Invalid Token", 401)
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: user_id } = verify(
            token,
            process.env.SECRET_TOKEN
        ) as IPayload


        request.user = {
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Invalid Token", 401);
    }
}