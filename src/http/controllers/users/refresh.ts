import { FastifyReply, FastifyRequest } from 'fastify'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  // criação do token JWT
  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  // criação de um refresh token pra validação do token principal
  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
