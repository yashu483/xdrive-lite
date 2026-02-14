import { Router } from "express";
import controller from "./../controllers/folderController.js";
const folderRouter = Router();

folderRouter.get("/", controller.foldersGet);
folderRouter.get("/:folderId", controller.foldersGet);

folderRouter.post("/", controller.folderPost);
folderRouter.post("/:folderId", controller.folderPost);

export default folderRouter;
