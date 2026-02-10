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

//importing server side modules and routes
import { prisma } from "./lib/prisma.js";
import indexRouter from "./routes/indexRouter.js";
import loginRouter from "./routes/loginRouter.js";
import signupRouter from "./routes/signupRouter.js";
import folderRouter from "./routes/foldersRouter.js";

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
      console.log(user);
      // checks if username exists
      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }

      const match = await bcrypt.compare(password, user.password);
      console.log(match);
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
  done(null, user.id);
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

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/folders", folderRouter);
app.use("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

app.listen(PORT, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`App is running on http://localhost:${PORT}`);
});
