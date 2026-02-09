import { Router } from "express";
import controller from "./../controllers/folderController.js";
const folderRouter = Router();

folderRouter.get("/", controller.foldersGet);

export default folderRouter;
