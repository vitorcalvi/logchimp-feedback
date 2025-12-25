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
      description: "Share your ideas and help us build better products",
      accentColor: "484d7c",
      logo: "https://www.dyagnosys.com/logo.webp",
      icon: "https://www.dyagnosys.com/logo.webp",
      isPoweredBy: false,
      allowSignup: false,
    },
  ]);
}

// NOTE: backward compatible with common.js for knex
exports.seed = seed;
