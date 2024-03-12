import { Knex } from 'knex'
import { DATABASE_TABLES } from '../../src/constants'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(DATABASE_TABLES.TRANSACTIONS, (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(DATABASE_TABLES.TRANSACTIONS)
}
