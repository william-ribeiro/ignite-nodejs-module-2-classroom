import fastify, { FastifyReply } from 'fastify'
import fastifyCooke from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { PATHS } from './constants'

export const app = fastify()

app.register(fastifyCooke)

app.get(PATHS.HEALTH_CHECK, (_, reply: FastifyReply) =>
  reply.status(200).send({
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: 'pong_',
    timestamp: new Date().getMilliseconds(),
  }),
)

app.register(transactionsRoutes, { prefix: PATHS.PREFIX_TRANSACTIONS })
