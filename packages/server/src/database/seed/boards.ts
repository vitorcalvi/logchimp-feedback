import { v4 as uuidv4 } from "uuid";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Check if boards already exist to prevent duplicates
  const existingBoards = await knex("boards").count("* as count").first();

  if (existingBoards && Number(existingBoards.count) > 0) {
    console.log("Boards already exist, skipping seed");
    return;
  }

  await knex("boards").insert([
    {
      boardId: uuidv4(),
      name: "Feature Requests",
      url: "feature-requests",
      color: "22c55e", // Green
      display: true,
      view_voters: true,
    },
    {
      boardId: uuidv4(),
      name: "Bug Reports",
      url: "bug-reports",
      color: "ef4444", // Red
      display: true,
      view_voters: true,
    },
    {
      boardId: uuidv4(),
      name: "General Feedback",
      url: "general-feedback",
      color: "3b82f6", // Blue
      display: true,
      view_voters: true,
    },
  ]);
}

// NOTE: backward compatible with common.js for knex
exports.seed = seed;
