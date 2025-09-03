import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, domain, theme, logo, adminEmail, adminPassword } = req.body;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        domain,
        theme,
        logo,
        users: {
          create: {
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
          }
        }
      },
      include: { users: true }
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating customer" });
  }
};
