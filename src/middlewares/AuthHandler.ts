import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PayloadType } from "../types/types";
import { CustomRequest } from "../types/types";

export const protectRoute = (
  allowedRole: string[]
): ((
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<void>) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      console.log(authHeader, "autthhh..123")

      if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({ message: "Access denied, No token provided" });
        return;
      }

      const token = authHeader.split(" ")[1];

      let role = req.headers["x-user-role"];

      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as PayloadType;


        if (!allowedRole.includes(decoded.role)) {
          res.status(403).json({
            message:
              "Access denied, you do not have permission to access this resource.",
          });
          return;
        }

        if(decoded?.exp && decoded.exp * 1000 < Date.now()){
          res.status(401).json({ message: "Token has expired", code: 'EXPIRED', role: role });
          return
        }

        req.user = decoded;
        next();
      } catch (jwtError: any) {
        if (jwtError.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token has expired", code: 'EXPIRED', role: role });
        } else {
          res.status(403).json({ message: "Invalid token" });
        }
        return;
      }
    } catch (err: any) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
};