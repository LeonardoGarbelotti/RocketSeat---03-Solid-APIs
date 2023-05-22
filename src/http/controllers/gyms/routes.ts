import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { search } from './search'
import { searchNearby } from './searchNearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // todas rotas abaixo desta vão chamar a verificação do middleware

  app.get('/gyms/search', search)

  app.get('/gyms/nearby', searchNearby)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
