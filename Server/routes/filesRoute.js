const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  listFiles,
  uploadFile,
  deleteAllFiles,
  downloadFile,
  viewFile,
  updateRemarkFile,
  updateStatusFile,
  updateTypeFile,
  countTypeFile,
  numFilesPerMonth,
  getStatus,
  numberFilesTypes,
  getFilesNumber,
  numberFilesTypesAndStatus,
  numFilesPerDay,
} = require("../controllers/filesController");
const checkAbilities = require("../Middlewares/checkAbilities");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", checkAbilities("read", "files"), async (req, res) => {
  try {
    const type = req.query.typeFile;
    const userID = req.query.userID;
    const files = await listFiles(userID, type);
    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/type", checkAbilities("read", "files"), async (req, res) => {
  try {
    const type = req.query.type;
    const userID = req.query.clientID;
    const files = await countTypeFile(type, userID);
    res.status(200).send(files);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get(
  "/number-files-uploaded-per-month",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const userID = req.query.id;
      const numberFiles = await numFilesPerMonth(userID, req.session.user.role);
      res.status(200).send(numberFiles);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/number-files-uploaded-per-day",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const userID = req.query.id;
      const numberFiles = await numFilesPerDay(userID, req.session.user.role);
      res.status(200).send(numberFiles);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/number-files",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const userID = req.query.id;
      const getFilesNum = await getFilesNumber(userID, req.session.user.role);
      res.status(200).send(getFilesNum);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/number-files-in-type",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const userID = req.query.id;
      const numberFilesType = await numberFilesTypes(
        userID,
        req.session.user.role
      );
      res.status(200).send(numberFilesType);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/number-files-by-type-and-status",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const userID = req.query.id;
      const numberFilesType = await numberFilesTypesAndStatus(
        userID,
        req.session.user.role
      );
      res.status(200).send(numberFilesType);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get("/all-status", checkAbilities("read", "files"), async (req, res) => {
  try {
    const userID = req.query.id;
    const status = await getStatus(userID, req.session.user.role);
    res.status(200).send(status);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post(
  "/upload",
  checkAbilities("create", "files"),
  upload.array("files"),
  async (req, res) => {
    try {
      const { uploaderID, clientID, filesNames, typeFile } = req.body;
      const uploadedFiles = req.files;
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).send({ message: "No files were uploaded" });
      }

      const filesNames1 = filesNames.split(",");
      const files = await uploadFile(
        uploaderID,
        clientID,
        uploadedFiles,
        filesNames1,
        typeFile
      );
      res.status(200).send({ message: `Files uploaded successfully` });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

router.delete(
  "/deleteAllFiles",
  checkAbilities("delete", "files"),
  async (req, res) => {
    try {
      await deleteAllFiles();
      res.status(200).send({ message: "All files deleted successfully" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/download/:fileId",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const fileId = req.params.fileId;
      const response = await downloadFile(res, fileId);
      response.data.pipe(res);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.get(
  "/view/:fileId",
  checkAbilities("read", "files"),
  async (req, res) => {
    try {
      const fileId = req.params.fileId;
      const response = await viewFile(res, fileId);
      response.data.pipe(res);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.put("/", checkAbilities("update", "files"), async (req, res) => {
  try {
    const fileId = req.body.id;
    const remark = req.body.remark;
    const status = req.body.status;
    const type = req.body.type;

    if (remark) {
      await updateRemarkFile(fileId, remark);
      res.status(200).send({ message: "update file successfully" });
    } else if (status) {
      await updateStatusFile(fileId, status);
      res.status(200).send({ message: "update file successfully" });
    } else if (type) {
      await updateTypeFile(fileId, type);
      res.status(200).send({ message: "update file successfully" });
    } else return res.status(400).send({ message: "No field to change" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
