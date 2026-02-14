import { prisma } from "./../lib/prisma.js";
import { body, validationResult, matchedData } from "express-validator";

const foldersGet = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(400).redirect("/");
      return;
    }

    const errors = req.validationErr | null;
    console.log();
    const folderId =
      typeof req.params.folderId === "string"
        ? Number(req.params.folderId)
        : null;

    const files = await prisma.files.findMany({
      where: {
        folderId: folderId,
      },
    });
    if (req.user && folderId) {
      const folder = await prisma.folders.findFirst({
        where: {
          id: folderId,
          userId: req.user.id,
        },
        include: {
          children: {
            select: {
              id: true,
              name: true,
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              files: true,
            },
          },
        },
      });
      console.log(folder, typeof errors, null, undefined);
      res.render("folders", { folder: folder, errors: errors });
      return;
    }
    if (req.user && !folderId) {
      const folders = await prisma.folders.findMany({
        where: {
          parentId: null,
          userId: req.user.id,
        },
        select: {
          name: true,
          id: true,
          _count: {
            select: {
              files: true,
            },
          },
        },
      });
      console.log(folders, errors);
      res.render("folders", { folders: folders, errors: errors });
      return;
    }
  } catch (err) {
    next(err);
  }
};

const validateFolderName = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("Folder name cannot be empty")
    .escape()
    .custom(async (value, { req }) => {
      const parentId =
        typeof req.params.folderId === "string"
          ? Number(req.params.folderId)
          : null;
      const folder = await prisma.folders.findFirst({
        where: {
          userId: req.user.id,
          name: value,
          parentId: req.params.folderId ? Number(req.params.folderId) : null,
        },
      });
      if (folder) {
        throw new Error("Folder name already exists.");
      }
      return true;
    }),
];
const folderPost = [
  validateFolderName,
  async (req, res) => {
    const errors = validationResult(req);
    const parentId = req.params.folderId;

    // checks for validation err
    if (!errors.isEmpty()) {
      res.locals.validationErr = errors.array();
      parentId
        ? res.redirect(`/folders/${parentId}`)
        : res.redirect("/folders");
      console.log(errors.array());
      return;
    }

    // if validation succeed
    const data = matchedData(req);
    await prisma.folders.create({
      data: {
        name: data.folderName,
        parentId: parentId ? Number(parentId) : null,
        userId: req.user.id,
      },
    });
    parentId ? res.redirect(`/folders/${parentId}`) : res.redirect("/folders");
  },
];

const folderDelete = (req, res, next) => {
  res.send("Delete");
};
const filesGet = async (req, res, next) => {};
const filesPost = async (req, res, next) => {};
const filesDelete = async (req, res, next) => {};
export default { foldersGet, folderDelete, folderPost };
