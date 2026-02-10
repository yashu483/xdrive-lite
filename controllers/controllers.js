import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";

import { prisma } from "./../lib/prisma.js";

const indexGet = (req, res, next) => {
  res.render("index");
};

const loginGet = (req, res, next) => {
  res.render("login");
};

const loginPost = (req, res, next) => {};

// validate login data
const validateLogin = [
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("username cannot be empty"),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("password cannot be empty"),
];

const signupGet = (req, res, next) => {
  res.render("signup");
};

// validate sign up data
const validateSignup = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .matches(/^[A-Za-z0-9._-]+$/)
    .withMessage(
      "username can only contain letters, numbers, underscore and dot.",
    )
    .isLength({ min: 3, max: 15 })
    .withMessage("username should be between 3 and 15 characters only")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (user) {
        throw new Error("username already exists");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password cannot be empty")
    .isStrongPassword({
      minLength: 5,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password should contain at least 1 uppercase,1 lowercase, 1 number, 1 symbol",
    ),
  body("confirmPass")
    .trim()
    .notEmpty()
    .withMessage("password confirmation did not matched.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password confirmation did not matched.");
      }
      return true;
    }),
];

const signupPost = [
  validateSignup,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("signup", { errors: errors.array() });
        return;
      }
      const user = matchedData(req);
      const hash = await bcrypt.hash(user.password, 10);

      await prisma.user.create({
        data: {
          username: user.username,
          password: hash,
        },
      });

      res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },
];

export default { indexGet, loginGet, loginPost, signupGet, signupPost };
