import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import path from "node:path";
import url from "node:url";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs";
const PORT = process.env.SERVER_PORT;

//importing server modules and routes
import { prisma } from "./lib/prisma";

const app = express();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//create new session
app.use(
  session({
    secret: "Great Secret",
    resave: false,
    saveUninitialized: false,
    name: "xdrive",
    expires: 24 * 60 * 60 * 1000,
  }),
);

app.use(passport.session());

//passport.js setup for authenticating  user using username and password
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      // checks if username exists
      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// make user object available in res.locals obj
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`App is running on http://localhost:${PORT}`);
});
