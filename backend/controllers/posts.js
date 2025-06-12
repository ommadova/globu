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
  favorite,
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
    const filter = {};

    // Optional filtering by country
    if (req.query.country) {
      filter.country = req.query.country;
    }

    const posts = await Post.find({})
      .populate("user", "name") // get name
      .sort({ createdAt: -1 }); // Newest first
    res.json(posts);
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
    const post = await Post.findByIdAndUpdate(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this post 🙁" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );

    updatedPost._doc.user = req.user._id; // To Ensure the user is set to the logged-in user
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
    console.log(err);
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
    post.comments.push(req.body);
    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

async function favorite(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const index = post.favoritedBy.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      // Not favorited yet, so add user
      post.favoritedBy.push(userId);
    } else {
      // Already favorited, so remove user
      post.favoritedBy.splice(index, 1);
    }

    await post.save();

    res.status(200).json({
      favoritedCount: post.favoritedBy.length,
      isFavorited: post.favoritedBy.some((id) => id.toString() === userId),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
