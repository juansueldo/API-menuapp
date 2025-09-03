import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const customer = await prisma.customer.upsert({
    where: { domain: "example.com" },
    update: {},
    create: {
      name: "Default Customer",
      domain: "example.com",
      theme: {
        primaryColor: "#1d4ed8",
        secondaryColor: "#9333ea",
        background: "#f9fafb"
      },
      logo: "https://via.placeholder.com/150",
      users: {
        create: {
          email: "admin@example.com",
          password: hashedPassword,
          role: "admin"
        }
      }
    }
  });

  console.log("✅ Seed completed:", customer);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
