import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepsitory = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepsitory)

  return useCase
}
