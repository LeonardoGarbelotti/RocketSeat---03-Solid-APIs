import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function create(request: FastifyRequest, reply: FastifyReply) {
  // cria schema de validação do ZOD de como será o cadastro de check-ins
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90 // Math.abs transforma o valor em positivo
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180 // Math.abs transforma o valor em positivo,
    }),
  })

  const { gymId } = createCheckInsParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const createCheckInUseCase = makeCheckInUseCase() // factory pattern

  await createCheckInUseCase.execute({
    gymId,
    userId: request.user.sub, // pega o ID do usuário que veio no corpo do token JWT
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
