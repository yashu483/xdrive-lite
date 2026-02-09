const foldersGet = (req, res, next) => {
  res.send("Folders");
};

const folderDelete = (req, res, next) => {
  res.send("Delete");
};

export default { foldersGet, folderDelete };
