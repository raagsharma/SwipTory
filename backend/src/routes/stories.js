const express = require("express");
const { authorizer, leanAuthroizer } = require("../utils/authorizer");
const { toObjectId } = require("../utils/objectid");
const { HTTPError } = require("../utils/error");
const { Story } = require("../models/story");
const { Like } = require("../models/like");
const { Bookmark } = require("../models/bookmark");

const router = express.Router();

router.get("/stories", leanAuthroizer, async (req, res) => {
  const userId = req?.auth?.userId;

  const stories = await Story.find();

  if (userId) {
    const likesPromise = Like.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const bookmarksPromise = Bookmark.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const [likes, bookmarks] = await Promise.all([
      likesPromise,
      bookmarksPromise,
    ]);

    for (const like of likes) {
      const story = stories.find((story) => story._id.equals(like.storyId));
      story.isLiked = true;
    }

    for (const bookmark of bookmarks) {
      const story = stories.find((story) => story._id.equals(bookmark.storyId));
      story.isBookmarked = true;
    }
  }

  return res.send(stories);
});

router.post("/story", authorizer, async (req, res) => {
  const userId = req.auth.userId;
  const story = await Story.create({
    ...req.body,
    userId: toObjectId(userId),
  });
  return res.send(story);
});

router.get("/story/me", authorizer, async (req, res) => {
  const userId = req.auth.userId;

  const stories = await Story.find({
    userId,
  });

  if (userId) {
    const likesPromise = Like.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const bookmarksPromise = Bookmark.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const [likes, bookmarks] = await Promise.all([
      likesPromise,
      bookmarksPromise,
    ]);

    for (const like of likes) {
      const story = stories.find((story) => story._id.equals(like.storyId));
      story.isLiked = true;
    }

    for (const bookmark of bookmarks) {
      const story = stories.find((story) => story._id.equals(bookmark.storyId));
      story.isBookmarked = true;
    }
  }

  return res.send(stories);
});

router.get("/story/bookmarked", authorizer, async (req, res) => {
  const userId = req.auth.userId;

  const bookmarks = await Bookmark.find({
    userId: toObjectId(userId),
  });

  const storyPromise = Story.find({
    _id: bookmarks.map((bookmark) => bookmark.storyId),
  });

  const likePromise = Like.find({
    userId: toObjectId(userId),
    storyId: {
      $in: bookmarks.map((bookmark) => bookmark.storyId),
    },
  });

  const [stories, likes] = await Promise.all([storyPromise, likePromise]);

  for (const like of likes) {
    const story = stories.find((story) => story._id.equals(like.storyId));
    story.isLiked = true;
  }

  for (const story of stories) {
    story.isBookmarked = true;
  }

  res.send(stories);
});

router.get("/story/:id", leanAuthroizer, async (req, res, next) => {
  try {
    const id = req.params.id;

    const userId = req?.auth?.userId;

    const story = await Story.findById(id);

    if (!story) throw new HTTPError(404, "Story not found");

    if (userId) {
      const likePromise = Like.exists({
        userId: toObjectId(userId),
        storyId: toObjectId(id),
      });

      const bookmarkPromise = Bookmark.exists({
        userId: toObjectId(userId),
        storyId: toObjectId(id),
      });

      const [like, bookmark] = await Promise.all([
        likePromise,
        bookmarkPromise,
      ]);

      if (like) {
        story.isLiked = true;
      }

      if (bookmark) {
        story.isBookmarked = true;
      }
    }

    return res.send(story);
  } catch (error) {
    next(error);
  }
});

router.put("/story/:id", authorizer, async (req, res) => {
  const id = req.params.id;

  const userId = req.auth.userId;
  const story = await Story.findByIdAndUpdate(id, {
    ...req.body,
    userId: toObjectId(userId),
  });
  return res.send(story);
});

router.delete("/story/:id", authorizer, async (req, res) => {
  const id = req.params.id;
  const userId = req.auth.userId;

  await Story.deleteOne({
    _id: id,
    userId,
  });

  return res.send("Story deleted successfully.");
});

router.get("/story/category/:category", leanAuthroizer, async (req, res) => {
  const category = req.params.category;

  const userId = req?.auth?.userId;

  const stories = await Story.find({
    category,
  });

  if (userId) {
    const likesPromise = Like.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const bookmarksPromise = Bookmark.find({
      userId: toObjectId(userId),
      storyId: {
        $in: stories.map((story) => story._id),
      },
    });

    const [likes, bookmarks] = await Promise.all([
      likesPromise,
      bookmarksPromise,
    ]);

    for (const like of likes) {
      const story = stories.find((story) => story._id.equals(like.storyId));
      story.isLiked = true;
    }

    for (const bookmark of bookmarks) {
      const story = stories.find((story) => story._id.equals(bookmark.storyId));
      story.isBookmarked = true;
    }
  }

  return res.send(stories);
});

router.get("/story/:id/likeCount", async (req, res) => {
  const id = req.params.id;

  try {
    const likeCount = await Like.find({
      storyId: toObjectId(id),
    }).countDocuments();
    return res.send({
      likeCount,
    });
  } catch (error) {
    res.status(400).send("Failed to fetch like count");
  }
});

router.post("/story/:id/like", authorizer, async (req, res) => {
  const id = req.params.id;

  const userId = req.auth.userId;

  try {
    await Like.create({
      storyId: toObjectId(id),
      userId: toObjectId(userId),
    });
  } catch (error) {}
  return res.send("Story liked successfully.");
});

router.post("/story/:id/unlike", authorizer, async (req, res) => {
  const id = req.params.id;

  const userId = req.auth.userId;

  try {
    await Like.deleteOne({
      storyId: toObjectId(id),
      userId: toObjectId(userId),
    });
  } catch (error) {}
  return res.send("Story like removed successfully.");
});

router.post("/story/:id/bookmark", authorizer, async (req, res) => {
  const id = req.params.id;

  const userId = req.auth.userId;

  try {
    await Bookmark.create({
      storyId: toObjectId(id),
      userId: toObjectId(userId),
    });
  } catch (error) {}
  return res.send("Story bookmarked successfully.");
});

router.post("/story/:id/unbookmark", authorizer, async (req, res) => {
  const id = req.params.id;

  const userId = req.auth.userId;

  try {
    await Bookmark.deleteOne({
      storyId: toObjectId(id),
      userId: toObjectId(userId),
    });
  } catch (error) {}
  return res.send("Story bookmark removed successfully.");
});

module.exports = router;
