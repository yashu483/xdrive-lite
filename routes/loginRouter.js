import { Router } from "express";
import controller from "../controllers/controllers.js";
import passport from "passport";

const loginRouter = Router();

loginRouter.get("/", controller.loginGet);
loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

export default loginRouter;
