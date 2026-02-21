import { Router } from "express";
import controller from "./../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/", controller.foldersGet);
folderRouter.get("/:folderId", controller.foldersGet);

// following routes post request for both folder creation and file upload
folderRouter.post("/", controller.folderPost);
folderRouter.post("/:folderId", controller.folderPost);

// delete action routes
folderRouter.get(
  "/delete/:folderId/:category/:itemId",
  controller.folderDelete,
);

// download action route ( only file )
folderRouter.get("/download/:folderId/:fileId", controller.downloadGet);

export default folderRouter;
