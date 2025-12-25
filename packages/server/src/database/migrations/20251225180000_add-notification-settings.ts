// utils
import logger from "../../utils/logger";

exports.up = (knex) => {
  return knex.schema
    .table("settings", (table) => {
      table.string("adminNotificationEmail");
      table.boolean("notifyOnNewPost").defaultTo(false);
    })
    .then(() => {
      logger.info({
        code: "DATABASE_MIGRATIONS",
        message: "Adding columns: adminNotificationEmail, notifyOnNewPost in settings",
      });
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: err,
      });
    });
};

exports.down = (knex) => {
  return knex.schema
    .table("settings", (table) => {
      table.dropColumn("adminNotificationEmail");
      table.dropColumn("notifyOnNewPost");
    })
    .then(() => {
      logger.info({
        code: "DATABASE_MIGRATIONS",
        message: "Dropping columns: adminNotificationEmail, notifyOnNewPost in settings",
      });
    })
    .catch((err) => {
      logger.log({
        level: "error",
        message: err,
      });
    });
};
