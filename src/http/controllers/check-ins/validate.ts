import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

/// Controller - Intermediar a requisição, repassar os dados para os casos de uso e retornar dados quando necessário.

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  // cria schema de validação do ZOD de como será o cadastro de check-ins
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInsParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase() // factory pattern

  await validateCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
