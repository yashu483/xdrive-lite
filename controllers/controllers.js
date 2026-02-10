import { prisma } from "./../lib/prisma.js";

const indexGet = (req, res, next) => {
  res.render("index");
};

const loginGet = (req, res, next) => {
  res.send("Login");
};

const loginPost = (req, res, next) => {
  res.send("loginpost");
};

const signupGet = (req, res, next) => {
  res.send("Sign Up");
};

const signupPost = (req, res, next) => {
  res.send("Signup post");
};

export default { indexGet, loginGet, loginPost, signupGet, signupPost };
