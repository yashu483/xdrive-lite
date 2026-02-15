import multer from "multer";

const upload = multer({
  dest: "./public/data/uploads",
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});

import { Router } from "express";
import controller from "./../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/", controller.foldersGet);
folderRouter.get("/:folderId", controller.foldersGet);

folderRouter.post("/", upload.array("files", 3), controller.folderPost);
folderRouter.post(
  "/:folderId",
  upload.array("files", 3),
  controller.folderPost,
);

export default folderRouter;
