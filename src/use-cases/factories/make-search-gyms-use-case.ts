import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepsitory = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepsitory)

  return useCase
}
