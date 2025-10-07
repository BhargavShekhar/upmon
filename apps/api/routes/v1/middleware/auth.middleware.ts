import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization!;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Invalid token format" });
    }

    const token = header.split(" ")[1];
    
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        let data = jwt.verify(token, process.env.JWT_SECRET!);
        req.userId = data.sub as string;
        next();
    } catch (error) {
        console.log("Middleware:: auth: could not authorize the user ", error);
        res.status(500).json({ msg: "Please try again later" });
    }
}