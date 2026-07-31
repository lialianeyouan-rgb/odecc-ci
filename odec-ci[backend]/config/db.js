const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const verifyDbConnection = async () => {
  await db.$queryRaw`SELECT 1`;
};

module.exports = { db, verifyDbConnection };
