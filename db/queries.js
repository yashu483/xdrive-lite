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
      const { originalname, mimetype, size } = file;
      const url = "mock.com";
      // TODO:HERE
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
    },
  });
  return fileData;
};
// Delete queries

export default {
  createFolder,
  storeFilesData,
  getFolderByFolderId,
  getFoldersForUser,
  checkFolderNameAvailability,
  getFilesByFolderId,
  getFilesForUser,
  getFileData,
};
