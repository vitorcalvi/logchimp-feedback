import type { Knex } from "knex";
import logger from "../../utils/logger";

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("posts", "screenshots");

  if (!hasColumn) {
    await knex.schema.alterTable("posts", (table) => {
      table.jsonb("screenshots").defaultTo("[]");
    });

    logger.info({
      code: "DATABASE_MIGRATIONS",
      message: "Added screenshots column to posts table",
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn("posts", "screenshots");

  if (hasColumn) {
    await knex.schema.alterTable("posts", (table) => {
      table.dropColumn("screenshots");
    });

    logger.info({
      code: "DATABASE_MIGRATIONS",
      message: "Dropped screenshots column from posts table",
    });
  }
}
