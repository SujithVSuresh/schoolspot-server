import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body); 
            next(); 
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error
              });
        }
    };
};

export default validateRequest;
