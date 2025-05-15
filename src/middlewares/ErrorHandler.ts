import { Request, Response, NextFunction } from "express"
import { CustomError } from "../utils/CustomError";

export const errorHandler = (err: CustomError , req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if(err instanceof CustomError){
        statusCode = err.statusCode;
        message = err.message;
    }

    console.error(err);

    res.status(statusCode).json({
        status: statusCode,
        message: message
    })
}