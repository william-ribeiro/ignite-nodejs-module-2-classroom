import type { Knex } from 'knex'
import { DATABASE_TABLES } from '../../src/constants'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DATABASE_TABLES.TRANSACTIONS, (table) => {
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DATABASE_TABLES.TRANSACTIONS, (table) => {
    table.dropColumn('session_id')
  })
}
