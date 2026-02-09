import { Router } from "express";
import controller from "../controllers/controllers.js";

const loginRouter = Router();

loginRouter.get("/", controller.loginGet);
loginRouter.post("/", controller.loginPost);

export default loginRouter;
