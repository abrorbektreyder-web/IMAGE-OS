import { createAuthClient } from 'better-auth/react';

// Auth endpointlari shu Next.js ilovasining o'zida (/api/auth/*) joylashgan,
// tashqi NestJS API'da emas. Shuning uchun brauzerda doim joriy origin
// ishlatiladi — NEXT_PUBLIC_APP_URL noto'g'ri qiymatga (masalan, Render API
// manziliga) o'rnatilgan bo'lsa ham auth buzilmaydi.
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const authClient = createAuthClient({ baseURL });

export const { signIn, signOut, signUp, useSession } = authClient;
