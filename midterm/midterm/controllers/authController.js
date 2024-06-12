const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const generateToken = require('../utils/tokenUtils');
import express from "express";
const userController = express.Router();


exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = new Profile();
    await profile.save();

    user = new User({
      username,
      password: hashedPassword,
      profileId: profile._id
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid ' });
    }

    const token = generateToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {

  res.status(200).json({ message: 'Logged out successfully' });
};


userController.get(
    "/user",
    asyncCatch(authen),
    asyncCatch(author),
    asyncCatch(getAllUsers)
);

userController.get("user/:userId", asyncCatch(getMe),asyncCatch(authen));

userController.post("user/", (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

userController.put("user/:userId", (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

userController.delete("user/:userId", (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export { userController };