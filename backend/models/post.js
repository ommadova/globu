const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    country: { type: String, required: true },
    content: { type: String },
    places: [String],
    foods: [String],
    drinks: [String],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],

    images: [imageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
