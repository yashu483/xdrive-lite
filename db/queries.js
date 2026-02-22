import { prisma } from "./../lib/prisma.js";

// Create queries
const createFolder = async (name, parentId, userId) => {
  await prisma.folders.create({
    data: {
      name,
      parentId,
      userId,
    },
  });
};

const storeFilesData = async (files, folderId, userId) => {
  await Promise.all(
    files.map((file) => {
      const { original_filename, resource_type, bytes, secure_url, public_id } =
        file;
      return prisma.files.create({
        data: {
          name: original_filename,
          resourceType: resource_type,
          size: bytes,
          url: secure_url,
          userId,
          folderId,
          publicId: public_id,
        },
      });
    }),
  );
};

// Read queries
const getFolderByFolderId = async (folderId, userId) => {
  const folder = await prisma.folders.findFirst({
    where: {
      id: folderId,
      userId,
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
          parentId: true,
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
  return folder;
};

const getFoldersForUser = async (userId) => {
  const folders = await prisma.folders.findMany({
    where: {
      parentId: null,
      userId,
    },
    select: {
      name: true,
      id: true,
      parentId: true,
      _count: {
        select: {
          files: true,
          children: true,
        },
      },
    },
  });
  return folders;
};

const checkFolderNameAvailability = async (userId, folderName, parentId) => {
  const folder = prisma.folders.findFirst({
    where: {
      userId,
      name: folderName,
      parentId,
    },
  });
  return folder;
};

const getFilesByFolderId = async (folderId, userId) => {
  const files = await prisma.files.findMany({
    where: {
      folderId,
      userId,
    },
  });

  return files;
};

const getFilesForUser = async (userId) => {
  const files = await prisma.files.findMany({
    where: {
      userId,
      folderId: null,
    },
  });
  return files;
};

const getFileData = async (id, userId, folderId) => {
  const fileData = await prisma.files.findFirst({
    where: {
      id,
      userId,
      folderId,
    },
    select: {
      id: true,
      name: true,
      url: true,
      publicId: true,
    },
  });
  return fileData;
};

const getFileDataForDelete = async (id, userId, folderId) => {
  const fileData = await prisma.files.findFirst({
    where: {
      id,
      userId,
      folderId,
    },
    select: {
      publicId: true,
      resourceType: true,
    },
  });
  return fileData;
};

// Delete queries
const deleteFile = async (id, userId, folderId) => {
  await prisma.files.delete({
    where: {
      id,
      folderId,
      userId,
    },
  });
};

const deleteFolder = async (id, userId, parentId) => {
  await prisma.folders.delete({
    where: {
      id,
      userId,
      parentId,
    },
  });
};

// raw sql queries
const getNestedFilesRaw = async (folderId, userId) => {
  const files = await prisma.$queryRaw`
WITH RECURSIVE folder_tree AS (
  SELECT "id"
  FROM "Folders"

  WHERE "id" = ${folderId}::int AND "userId" = ${userId}::int

  UNION ALL

  SELECT f."id"
  FROM "Folders" f
  INNER JOIN folder_tree ft
    ON f."parentId" = ft."id"
)

SELECT
  "id",
  "publicId",
  "resourceType",
  "userId",
  "folderId"
FROM "Files"
WHERE "folderId" IN (
  SELECT "id" FROM folder_tree
);
`;

  return files;
};
export default {
  createFolder,
  storeFilesData,
  getFolderByFolderId,
  getFoldersForUser,
  checkFolderNameAvailability,
  getFilesByFolderId,
  getFilesForUser,
  getFileData,
  deleteFile,
  getFileDataForDelete,
  getNestedFilesRaw,
  deleteFolder,
};
