import { UsersInterfaceRepository } from '@/repositories/users-interface-repository'
import { InvalidCredentialsErrors } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

// Toda função deve receber um parâmetro e devolver algo, uma resposta.
export class AuthenticateUseCase {
  constructor(private usersInterfaceRepository: UsersInterfaceRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // Para autenticar, primeiro buscar o email do usuário no banco de dados
    const user = await this.usersInterfaceRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsErrors()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsErrors()
    }

    return {
      user,
    }
  }
}
