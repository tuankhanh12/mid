const jwt = require('jsonwebtoken');
const User = require('../models/User');
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "dash";


const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;


export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
    roles: ["user"],
  });


  res.status(200).send(user);
};

export const login = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await UserModel.findOne({
    username: username || { $ne: null },
    email: email || { $ne: null },
  });

  const result = bcrypt.compare(password, user.password);
  if (!result) {
    throw new Error("Username, email or password not correct!");
  }

  const payload = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    roles: user.roles,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  return res.status(200).send({ accessToken, refreshToken });
};

export const refresh = (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

 
  const newPayload = _.omit(payload, ["exp", "iat"]);

  const accessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "30s",
  });

  const newRefreshToken = jwt.sign(newPayload, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  return res.status(200).send({ accessToken, refreshToken: newRefreshToken });
};