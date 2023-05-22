import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersInterfaceRepository } from '@/repositories/in-memory/in-memory-users-interface-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsErrors } from './errors/invalid-credentials-error'

let usersInterfaceRepository: InMemoryUsersInterfaceRepository
let sut: AuthenticateUseCase // sut = system under test

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersInterfaceRepository = new InMemoryUsersInterfaceRepository()
    sut = new AuthenticateUseCase(usersInterfaceRepository)
  })

  it('Should be able to authenticate', async () => {
    // cria usuário no banco em memória
    await usersInterfaceRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // faz a autenticação do usuário criado
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    // como o authenticate tem uma resposta um User, verificamos se retornou algum id, qualquer seja
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not be able to authenticate with wrong email', async () => {
    // cria usuário no banco em memória
    await usersInterfaceRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // faz a autenticação do usuário criado
    await expect(() =>
      sut.execute({
        email: 'johndoe123@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErrors)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    // cria usuário no banco em memória
    await usersInterfaceRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // faz a autenticação do usuário criado
    await expect(() =>
      sut.execute({
        email: 'johndoe123@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsErrors)
  })
})
