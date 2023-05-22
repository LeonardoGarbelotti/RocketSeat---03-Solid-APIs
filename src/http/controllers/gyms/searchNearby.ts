import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function searchNearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // cria schema de validação do ZOD
  const searchNearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90 // Math.abs transforma o valor em positivo
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180 // Math.abs transforma o valor em positivo,
    }),
  })

  const { latitude, longitude } = searchNearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase() // factory pattern

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
