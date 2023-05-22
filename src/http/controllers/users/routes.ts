import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
  // Rota de Criação de Usuários
  app.post('/users', register)

  // Rota de autenticação de usuários
  app.post('/sessions', authenticate)

  // Rota de atualização do token JWT
  app.patch('/token/refresh', refresh)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile) // middleware de autenticação
}
