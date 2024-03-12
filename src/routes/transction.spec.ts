import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'

import { app } from '../app'
import { PATHS } from '../constants'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/' + PATHS.PREFIX_TRANSACTIONS)
      .send({
        title: 'test transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/' + PATHS.PREFIX_TRANSACTIONS)
      .send({
        title: 'test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/' + PATHS.PREFIX_TRANSACTIONS)
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'test transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/' + PATHS.PREFIX_TRANSACTIONS)
      .send({
        title: 'test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/' + PATHS.PREFIX_TRANSACTIONS)
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/${PATHS.PREFIX_TRANSACTIONS}/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'test transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/' + PATHS.PREFIX_TRANSACTIONS)
      .send({
        title: 'test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/' + PATHS.PREFIX_TRANSACTIONS)
      .set('Cookie', cookies)
      .send({
        title: 'test transaction',
        amount: 3000,
        type: 'debit',
      })

    const transactionSummaryResponse = await request(app.server)
      .get(`/${PATHS.PREFIX_TRANSACTIONS}${PATHS.SUMMARY}`)
      .set('Cookie', cookies)

    expect(transactionSummaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 2000,
      }),
    )
  })
})
