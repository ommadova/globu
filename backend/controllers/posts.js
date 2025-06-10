const Post = require("../models/post");

module.exports = {
  index,
  create,
  show,
  update,
  delete: deletePost,
  createComment,
  favorite,
  addImages,
  deleteImage,
};

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
    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to creat post" });
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

async function addImages(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { images } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "An array of image URLs is required" });
    }

    for (const img of images) {
      if (img.url) post.images.push({ url: img.url });
    }

    await post.save();

    res.status(200).json(post.images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteImage(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "Image URL required" });

    const initialCount = post.images.length;
    post.images = post.images.filter((img) => img.url !== url);

    if (post.images.length === initialCount) {
      return res.status(404).json({ message: "Image not found" });
    }

    await post.save();
    res.status(200).json({ message: "Image removed", images: post.images });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
