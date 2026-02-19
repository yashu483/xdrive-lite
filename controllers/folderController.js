import { prisma } from "./../lib/prisma.js";
import { body, validationResult, matchedData } from "express-validator";
import multer from "multer";

const foldersGet = async (req, res, next) => {
  try {
    // check if user is not logged in OR path id is not a number
    if (
      !req.user ||
      (req.params.folderId && isNaN(Number(req.params.folderId)))
    ) {
      res.status(400).redirect("/");
      return;
    }

    // gets errors from failed validation redirected from POST req to folders
    const errors = req.session.validationErr ? req.session.validationErr : null;

    const folderIdParam = req.params.folderId;
    const folderId = folderIdParam !== undefined ? Number(folderIdParam) : null;

    if (folderIdParam !== undefined && isNaN(folderId)) {
      return res.status(400).redirect("/");
    }

    // if there is folderId, that means request is for a nested directory
    if (req.user && folderId != null) {
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
              _count: {
                select: {
                  files: true,
                  children: true,
                },
              },
            },
          },
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          files: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              files: true,
              children: true,
            },
          },
        },
      });

      if (!folder) {
        // redirect to folder page because user requested for non-existent folder
        res.redirect("/folders");
        return;
      }
      const files = await prisma.files.findMany({
        where: {
          folderId: folderId,
          userId: req.user.id,
        },
      });
      const shortenDateArr = await Promise.all(
        files.map((file) => {
          const date = file.createdAt;
          const formatted = date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          return { ...file, createdAt: formatted };
        }),
      );
      res.status(200).render("folders", {
        folder: folder,
        files: shortenDateArr,
        errors: errors,
      });
      if (errors) delete req.session.validationErr;
      return;
    }

    // if there is no folderId, that means request is for home directory
    if (req.user && folderId == null) {
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
              children: true,
            },
          },
        },
      });
      const files = await prisma.files.findMany({
        where: {
          folderId: null,
          userId: req.user.id,
        },
      });
      const shortenDateArr = await Promise.all(
        files.map((file) => {
          const date = file.createdAt;
          const formatted = date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return { ...file, createdAt: formatted };
        }),
      );
      res.render("folders", {
        folders: folders,
        files: shortenDateArr,
        errors: errors,
      });
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
          parentId: parentId ? Number(req.params.folderId) : null,
        },
      });
      if (folder) {
        throw new Error("Folder name already exists.");
      }
      return true;
    }),
];

const upload = multer({
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});

const getMulterErrMsg = (code) => {
  switch (code) {
    case "LIMIT_FILE_SIZE":
      {
        return "File size must be less than 5MB.";
      }
      break;
    case "LIMIT_FILE_COUNT":
      {
        return "You can upload maximum 3 files.";
      }
      break;
    default:
      return "Upload error occurred.";
  }
};

const createFolderReq = async (req, res) => {
  const errors = validationResult(req);
  const parentId = req.params.folderId;

  // checks for validation err
  if (!errors.isEmpty()) {
    req.session.validationErr = errors.array();
    parentId ? res.redirect(`/folders/${parentId}`) : res.redirect("/folders");
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
};

const createFilesReq = async (req, res) => {
  const files = req.files;
  const userId =
    typeof req.user.id === "string" ? Number(req.user.id) : req.user.id;

  const folderId = req.params.folderId ? Number(req.params.folderId) : null;

  await Promise.all(
    files.map((file) => {
      const { originalname, mimetype, size } = file;
      const url = "mock.com";
      return prisma.files.create({
        data: {
          name: originalname,
          mimetype,
          size,
          url,
          userId,
          folderId,
        },
      });
    }),
  );
  if (req.params.folderId)
    return res.redirect(`/folders/${req.params.folderId}`);
  res.redirect("/folders");
};

const folderPost = [
  validateFolderName,
  async (req, res) => {
    if (req.body?.folderName !== undefined) {
      await createFolderReq(req, res);
      return;
    }
    upload.array("files")(req, res, async (err) => {
      if (err || req.files.length === 0) {
        let msg = [];
        if (err instanceof multer.MulterError) {
          msg.push(getMulterErrMsg(err.code));
        } else {
          msg.push("Something went wrong during upload.");
        }
        req.session.multerErr = msg;
        if (req.params.folderId) {
          res.redirect(`/folders/${req.params.folderId}`);
          return;
        }
        res.redirect("/folders");
        return;
      }
      await createFilesReq(req, res);
    });
  },
];

const folderDelete = (req, res, next) => {
  res.send("Delete");
};
// TODO:const filesGet = async (req, res, next) => {};
// TODO:const filesPost = async (req, res, next) => {};
// TODO:const filesDelete = async (req, res, next) => {};
export default { foldersGet, folderDelete, folderPost };
