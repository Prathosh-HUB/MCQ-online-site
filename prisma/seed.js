const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@gmail.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin Created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());