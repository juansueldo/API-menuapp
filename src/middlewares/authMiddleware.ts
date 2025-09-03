import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    customerId: number;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      customerId: number;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { customer: true }
    });

    if (!user || user.customerId !== decoded.customerId) {
      return res.status(401).json({ error: "Invalid tenant or user" });
    }

    req.user = {
      id: user.id,
      customerId: user.customerId,
      role: user.role
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};
