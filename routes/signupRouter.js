import { Router } from "express";
import controller from "../controllers/controllers.js";

const signupRouter = Router();

signupRouter.get("/", controller.signupGet);
signupRouter.post("/", controller.signupPost);

export default signupRouter;
