const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HTTPError } = require("../utils/error");

const SALT_ROUNDS = 10;

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
      throw new HTTPError(400, "Invalid username or password");

    const user = await User.findOne({
      username,
    });

    if (!user) throw new HTTPError(400, "Invalid username or password");

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) throw new HTTPError(400, "Invalid username or password");

    const accessToken = jwt.sign(
      { username, userId: user.id },
      process.env.JWT_SECRET
    );

    return res.send({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
      throw new HTTPError(400, "Invalid username or password");

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      await User.create({
        username,
        password: hashedPassword,
      });

      return res.send({
        message: "User created successfully",
      });
    } catch (error) {
      throw new HTTPError(400, "User already exists");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
