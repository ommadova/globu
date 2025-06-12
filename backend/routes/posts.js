const express = require("express");
const router = express.Router();
const upload = require("multer")();
const postsCtrl = require("../controllers/posts");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// All paths start with '/api/posts'

// GET /api/posts (INDEX action)
router.get("/", postsCtrl.index);
// GET /api/posts/:postId (SHOW action)
router.get("/:postId", postsCtrl.show);

// Protect all defined routes
router.use(ensureLoggedIn);
// POST /api/posts (CREATE action)
router.post("/", upload.single("image"), postsCtrl.create);
// PUT /api/posts/:postId (UPDATE action)
router.put("/:postId", postsCtrl.update);
// DELETE /api/posts/:postId (DELETE action)
router.delete("/:postId", postsCtrl.delete);
// POST /api/posts/:postId/comments (CREATE comment action)
router.post("/:postId/comments", postsCtrl.createComment);
// POST /api/posts/:postId/favorite (FAVORITE action)
router.post("/:postId/favorite", postsCtrl.favorite);

module.exports = router;
