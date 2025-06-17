const Post = require("../models/post");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const { S3_REGION, S3_BUCKET, S3_BASE_URL } = process.env;

module.exports = {
  index,
  create,
  show,
  update,
  delete: deletePost,
  createComment,
  addReaction,
};

// --- Helper function to upload a file to S3 ---
async function uploadFile(file) {
  const s3 = new S3Client({ region: S3_REGION });

  const key = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
  };

  await s3.send(new PutObjectCommand(params));
  return `${S3_BASE_URL}/${S3_BUCKET}/${key}`;
}

async function index(req, res) {
  try {
    const posts = await Post.find({})
      .populate("user", "name") // get name
      .sort({ createdAt: -1 }); // Newest first

    const countries = Post.schema.path("country").enumValues; // Get enum values for country
    res.json({ posts, countries });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

async function create(req, res) {
  try {
    req.body.user = req.user._id;

    if (req.files && req.files.length > 0) {
      const uploadedUrls = await Promise.all(
        req.files.map((file) => uploadFile(file))
      );
      req.body.images = uploadedUrls.map((url) => ({ url }));
      req.body.imageUrl = uploadedUrls[0];
    }

    if (req.body.places) req.body.places = JSON.parse(req.body.places);
    if (req.body.foods) req.body.foods = JSON.parse(req.body.foods);
    if (req.body.drinks) req.body.drinks = JSON.parse(req.body.drinks);

    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create post" });
  }
}

async function show(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("user", "name")
      .populate("comments.user", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
}

async function update(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.files && req.files.length > 0) {
      const uploadedUrls = await Promise.all(
        req.files.map((file) => uploadFile(file))
      );
      req.body.images = uploadedUrls.map((url) => ({ url }));
      req.body.imageUrl = uploadedUrls[0];
    }

    if (req.body.places) req.body.places = JSON.parse(req.body.places);
    if (req.body.foods) req.body.foods = JSON.parse(req.body.foods);
    if (req.body.drinks) req.body.drinks = JSON.parse(req.body.drinks);

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post 🙁" });
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json(deletedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
}

async function createComment(req, res) {
  try {
    req.body.user = req.user._id;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentData = {
      text: req.body.text,
      user: req.body.user,
      replyTo: req.body.replyTo || null,
    };

    post.comments.push(commentData);
    await post.save();
    const updatedPost = await Post.findById(req.params.postId).populate(
      "comments.user",
      "name"
    );
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

async function addReaction(req, res) {
  try {
    const { emoji } = req.body;
    const userId = req.user._id.toString();
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Initialize if not present
    if (!post.reactions.has(emoji)) {
      post.reactions.set(emoji, []);
    }

    const userIndex = post.reactions.get(emoji).indexOf(userId);

    if (userIndex === -1) {
      post.reactions.get(emoji).push(userId);
    } else {
      post.reactions.get(emoji).splice(userIndex, 1);
      if (post.reactions.get(emoji).length === 0) {
        post.reactions.delete(emoji);
      }
    }

    await post.save();
    res.status(200).json({ reactions: post.reactions });
  } catch (err) {
    console.error("Reaction error:", err);
    res.status(500).json({ message: "Failed to add reaction" });
  }
}
