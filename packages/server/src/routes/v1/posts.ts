// modules
import express from "express";
const router = express.Router();

// controller
import * as post from "../../controllers/post";
import { createWithMagicLink } from "../../controllers/post/createWithMagicLink";

// middleware
import { authOptional, authRequired } from "../../middlewares/auth";
import { magicLinkAuth } from "../../middlewares/auth/magicLinkAuth";
import { postExists } from "../../middlewares/postExists";

router.post("/posts/get", authOptional, post.filterPost);
router.post("/posts/slug", authOptional, postExists, post.postBySlug);

router.post("/posts", authRequired, post.create);
router.patch("/posts", authRequired, postExists, post.updatePost);

router.delete("/posts", authRequired, postExists, post.deleteById);

// magic link post creation
router.post("/posts/magic-link", magicLinkAuth, createWithMagicLink);

export default router;
