import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

// Ambiente de DEV os logs serão mostrados como query do banco
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
