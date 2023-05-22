import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function search(request: FastifyRequest, reply: FastifyReply) {
  // cria schema de validação do ZOD
  const searchQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase() // factory pattern

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
