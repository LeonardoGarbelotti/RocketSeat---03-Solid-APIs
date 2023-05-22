import { InvalidCredentialsErrors } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // cria schema de validação do ZOD de como será o cadastro de usuário
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase() // factory pattern

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // criação do token JWT
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // criação de um refresh token pra validação do token principal
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // quais rotas da aplicação tem acesso a esse cookie
        secure: true, // HTTPS
        sameSite: true, // token acessível somente neste domínio
        httpOnly: true, // o token é acessado somente pelo backend
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsErrors) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
