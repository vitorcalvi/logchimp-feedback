/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("settings").del();
  await knex("settings").insert([
    {
      title: "Dyagnosys Feedback",
      description: "Track user feedback to build better products",
      accentColor: "484d7c",
      logo: "/dyagnosys-logo.webp",
      icon: "/dyagnosys-logo.webp",
      isPoweredBy: false,
    },
  ]);
}

// NOTE: backward compatible with common.js for knex
exports.seed = seed;
