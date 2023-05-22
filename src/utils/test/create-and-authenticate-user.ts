import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  // cria um usuário
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
      password_hash: await hash('123456', 6),
    },
  })

  // faz requisição para rota de autenticação
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  // acessa a rota do profile
  const { token } = authResponse.body

  // retorna o token
  return {
    token,
  }
}
