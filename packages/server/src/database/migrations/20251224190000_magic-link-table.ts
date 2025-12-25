// utils
import logger from "../../utils/logger";

exports.up = (knex) => {
  return knex.schema
    .createTable("magicLink", (table) => {
      table.uuid("id").notNullable().unique().primary();
      table.string("email", 320).notNullable();
      table
        .uuid("boardId")
        .notNullable()
        .references("boardId")
        .inTable("boards")
        .onDelete("cascade");
      table.string("token", 500).notNullable().unique();
      table
        .uuid("userId")
        .nullable()
        .references("userId")
        .inTable("users")
        .onDelete("set null");
      table.boolean("used").defaultTo(false);
      table.timestamp("expiresAt").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    })
    .then(() => {
      logger.info({
        code: "DATABASE_MIGRATIONS",
        message: "Creating table: magicLink",
      });
    })
    .catch((err) => {
      logger.error(err);
    });
};

exports.down = (knex) => {
  return knex.schema
    .hasTable("magicLink")
    .then((exists) => {
      if (exists) {
        return knex.schema.dropTable("magicLink");
      }
    })
    .then(() => {
      logger.info({
        message: "Dropping table: magicLink",
      });
    })
    .catch((err) => {
      logger.error(err);
    });
};
