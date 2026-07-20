import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

// Dev'da hot-reload har safar yangi PrismaClient ochib qo'ymasligi uchun
// global instansiya qayta ishlatiladi.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Google OAuth redirect'lari to'g'ri qurilishi uchun serverdagi baseURL
// aniq bo'lishi kerak. Vercelda BETTER_AUTH_URL o'rnatilmagan bo'lsa,
// production domenga tushamiz (NEXT_PUBLIC_APP_URL ishlatilmaydi — u
// tashqi API manziliga qo'yilgan bo'lishi mumkin).
const baseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL ? 'https://image-os-web.vercel.app' : 'http://localhost:3000');

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    'http://localhost:3000',
    'https://image-os-web.vercel.app',
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
