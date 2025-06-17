const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    country: {
      type: String,
      required: true,
      enum: [
        "France",
        "Spain",
        "United States",
        "Italy",
        "Turkey",
        "Mexico",
        "Thailand",
        "Germany",
        "United Kingdom",
        "Japan",
        "China",
        "Austria",
        "Greece",
        "Portugal",
        "United Arab Emirates",
        "Russia",
        "Switzerland",
        "Belgium",
        "Brazil",
        "South Africa",
        "Poland",
        "Netherlands",
        "South Korea",
        "Other",
      ],
    },
    customCountry: { type: String },
    content: { type: String },
    places: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    foods: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    drinks: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    imageUrl: {
      type: String,
      default: "https://i.imgur.com/KTEjbsw.png",
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],

    reactions: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
