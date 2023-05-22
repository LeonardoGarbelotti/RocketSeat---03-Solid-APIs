import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    /* quando o usuário fazer login, será recebido no header da requisição um token JWT
   este token deve ser lido e validado para completar o login.
   A função jwtVerify verifica a rquisição e traz as informações do token */
    await request.jwtVerify()
  } catch (err) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
