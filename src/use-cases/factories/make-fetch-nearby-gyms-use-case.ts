import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepsitory = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepsitory)

  return useCase
}
