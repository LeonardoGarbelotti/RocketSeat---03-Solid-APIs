import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check In controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in ', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    // pesquisa o primeiro usuário que encontrar no banco
    const user = await prisma.user.findFirstOrThrow()

    // cria uma nova academia
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -22.743402,
        longitude: -50.393476,
      },
    })

    // cria um check-in
    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    // faz requisição para rota validate
    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    // busca e armazena na variável o check-in criado
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    // verifica se após a requisição da rota, foi preenchido o campo 'validated_at'
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
