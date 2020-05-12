const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //hashing password
const jwt = require("jsonwebtoken"); //jwt token generation

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Aqib Mirza",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //projection concept
  } catch (error) {
    error = new HttpError("Fetching users failed, please try again", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) }); //mapping an object to js
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    ); //422 - invalid response
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    error = new HttpError("Signing up failed, please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //hashing the password variable + salting
  } catch (error) {
    const error = new HttpError("Could not create user", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword, //setting variable to hashed password
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      //returns a token
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    error = new HttpError("Logging in failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    error = new HttpError("Invalid credentials, could not log you in", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const error = new HttpError(
      "Please check your credentials, could not log you in",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    error = new HttpError("Invalid credentials, could not log you in", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(     //returns a token
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY, //use same token, as it changes per key
      { expiresIn: "1h" }
    );
  } catch (error) {
    const error = new HttpError("Logging in failed", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
