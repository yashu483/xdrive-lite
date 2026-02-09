import { Router } from "express";
import controller from "../controllers/controllers.js";

const indexRouter = Router();

indexRouter.get("/", controller.indexGet);

export default indexRouter;
