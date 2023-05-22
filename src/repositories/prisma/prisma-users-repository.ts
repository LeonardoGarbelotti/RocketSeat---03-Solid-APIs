import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersInterfaceRepository } from '../users-interface-repository'

// repositórios contém funções que fazem alterações com o banco de dados
export class PrismaUsersRepository implements UsersInterfaceRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
