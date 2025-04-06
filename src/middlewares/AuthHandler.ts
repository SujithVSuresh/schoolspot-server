import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PayloadType } from "../types/types";
import { CustomRequest } from "../types/types";


export const protectRoute = (
    allowedRole: string[]
  ): (req: CustomRequest, res: Response, next: NextFunction) => Promise<void> => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
  
            if (!authHeader || !authHeader.startsWith("Bearer")) {
                res.status(401).json({ message: "Access denied, No token provided" });
                return;  
            }
  
            const token = authHeader.split(" ")[1];
  
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as PayloadType;

            console.log("Decoded token:", decoded);


            if(!allowedRole.includes(decoded.role)){
                res.status(403).json({ message: "Access denied, you do not have permission to access this resource." });
               return;  
            }
  
            const currentTime = Math.floor(Date.now() / 1000);
  
            if (decoded.exp as number < currentTime) {
                res.status(401).json({ message: "Token expired" });
                return;  
            }
  
            req.user = decoded;
            next();  
  
        } catch (error) {
            console.error(error);  
            res.status(403).json({ message: "Invalid or expired token" });
            return;  
        }
    };
  };
    
  