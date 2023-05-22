import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersInterfaceRepository } from '@/repositories/in-memory/in-memory-users-interface-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersInterfaceRepository: InMemoryUsersInterfaceRepository
let sut: RegisterUseCase // sut = system under test

describe('Register Use Case', () => {
  beforeEach(() => {
    usersInterfaceRepository = new InMemoryUsersInterfaceRepository()
    sut = new RegisterUseCase(usersInterfaceRepository)
  })

  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Test name',
      email: 'testEmail@test.com',
      password: '12345678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Test name',
      email: 'testEmail@test.com',
      password: '12345678',
    })

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not to be able to register a user with same email', async () => {
    const email = 'testEmail@test.com'

    await sut.execute({
      name: 'Test name',
      email,
      password: '12345678',
    })

    await expect(() =>
      sut.execute({
        name: 'Test name',
        email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
