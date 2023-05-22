import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearby } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query, // o título não será igual a query, e sim vai conter aquela palavra
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  // utilizado o queryRaw pra inserir uma query já pronta do cálculo de distancia
  async findManyNearby({ latitude, longitude }: findManyNearby) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT  * FROM gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}
