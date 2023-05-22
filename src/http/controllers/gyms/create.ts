import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function create(request: FastifyRequest, reply: FastifyReply) {
  // cria schema de validação do ZOD de como será o cadastro de academias
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90 // Math.abs transforma o valor em positivo
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180 // Math.abs transforma o valor em positivo,
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase() // factory pattern

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
