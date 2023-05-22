import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersInterfaceRepository } from '@/repositories/in-memory/in-memory-users-interface-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersInterfaceRepository: InMemoryUsersInterfaceRepository
let sut: GetUserProfileUseCase // sut = system under test

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersInterfaceRepository = new InMemoryUsersInterfaceRepository()
    sut = new GetUserProfileUseCase(usersInterfaceRepository)
  })

  it('Should be able to get user profile', async () => {
    // cria usuário no banco em memória
    const createdUser = await usersInterfaceRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // executa o caso de uso para buscar um usuário
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    // como o authenticate tem uma resposta um User, verificamos se retornou algum id, qualquer seja
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('Should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
