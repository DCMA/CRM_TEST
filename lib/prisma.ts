import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma 7 requires an explicit driver adapter (no implicit DATABASE_URL
// connection), see https://pris.ly/d/driver-adapters.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
