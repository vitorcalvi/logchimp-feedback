import type { Knex } from "knex";
import logger from "../../utils/logger";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("password", 72).nullable().alter();
  });

  logger.info({
    code: "DATABASE_MIGRATIONS",
    message: "Made password column nullable for magic link users",
  });
}

export async function down(knex: Knex): Promise<void> {
  // Note: This down migration may fail if there are users with null passwords
  await knex.schema.alterTable("users", (table) => {
    table.string("password", 72).notNullable().alter();
  });

  logger.info({
    code: "DATABASE_MIGRATIONS",
    message: "Reverted password column to not nullable",
  });
}
