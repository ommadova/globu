const express = require("express");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const commentsCtrl = require("../controllers/comments");

const router = express.Router();

router.use(ensureLoggedIn);

// PUT /api/posts/:postId/comments/:commentId (UPDATE comment action)
router.put("/:postId/comments/:commentId", commentsCtrl.update);
// DELETE /api/posts/:postId/comments/:commentId (DELETE comment action)
router.delete("/:postId/comments/:commentId", commentsCtrl.delete);

module.exports = router;
