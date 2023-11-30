const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.ObjectId,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
  },
});

const Like = mongoose.model("likes", likeSchema);

module.exports = {
  Like,
};
