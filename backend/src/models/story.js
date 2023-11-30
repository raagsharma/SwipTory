const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const storySchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
    },
    isLiked: {
      type: Boolean,
    },
    isBookmarked: {
      type: Boolean,
    },
    slides: [slideSchema],
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("stories", storySchema);

module.exports = {
  Story,
};
