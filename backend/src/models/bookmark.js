const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.ObjectId,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
  },
});

const Bookmark = mongoose.model("bookmarks", bookmarkSchema);

module.exports = {
  Bookmark,
};
