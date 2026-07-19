import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';

const handlers = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
  return handlers.GET(req);
};

export const POST = async (req: NextRequest) => {
  return handlers.POST(req);
};
