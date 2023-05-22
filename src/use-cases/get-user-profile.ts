import { UsersInterfaceRepository } from '@/repositories/users-interface-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

// Toda função deve receber um parâmetro e devolver algo, uma resposta.
export class GetUserProfileUseCase {
  constructor(private usersInterfaceRepository: UsersInterfaceRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    // primeiro buscar o ID do usuário no banco de dados
    const user = await this.usersInterfaceRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
