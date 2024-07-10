const model = require("../models/filesModel");
const { getClientIDOrEmployeeIDByUserID } = require("../models/usersModel");
const { google } = require("googleapis");
const { Readable } = require("stream");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const SERVICE_ACCOUNT_KEY_FILE = path.join(
  __dirname,
  "../southern-waters-425513-d6-3bb59649cf3c.json"
);

const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_KEY_FILE,
  scopes: SCOPES,
});

function bufferToStream(buffer) {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function listFiles(userID, type) {
  try {
    let files;
    const realID = await getClientIDOrEmployeeIDByUserID(userID);
    if (realID[0].client_id) {
      const result = await model.getFilesByClientID(userID, type);
      files = result;
    } else {
      const result = await model.getFilesByEmployeeID(
        realID[0].employee_id,
        type
      );
      files = result;
    }
    const filteredFiles = files.filter((file) => file.id !== null);

    return filteredFiles;
  } catch (error) {
    throw error;
  }
}

async function uploadFile(uploaderID, clientID, uploadedFiles, filesNames, type) {
  try {
    for (const [index, file] of uploadedFiles.entries()) {
      if (file.mimetype !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }
      const fileId = await uploadFileToDrive(file.buffer, file.originalname);
      await model.saveFileToDB(
        fileId,
        filesNames[index],
        type,
        uploaderID,
        clientID
      );
    }
    return;
  } catch (error) {
    throw error;
  }
}

async function uploadFileToDrive(fileBuffer, fileName) {
  const drive = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: fileName,
  };

  const media = {
    mimeType: "application/pdf",
    body: bufferToStream(fileBuffer),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    return file.data.id;
  } catch (err) {
    throw new Error("Error uploading file: " + err.message);
  }
}

async function deleteAllFiles() {
  try {
    await deleteAllFilesInFolder("root");
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

async function deleteAllFilesInFolder(folderId) {
  try {
    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });
    const files = response.data.files;
    for (const file of files) {
      if (file.mimeType === "application/vnd.google-apps.folder") {
        await deleteAllFilesInFolder(drive, file.id);
      }

      try {
        await drive.files.delete({ fileId: file.id });
        console.log(`Deleted ${file.name} (${file.id})`);
      } catch (error) {
        if (
          error.errors &&
          error.errors[0] &&
          error.errors[0].reason === "notFound"
        ) {
          console.log(`File not found: ${file.id}`);
        } else {
          console.error(`Error deleting ${file.name} (${file.id}):`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error listing files in folder ${folderId}:`, error);
  }
}

async function downloadFile(res, fileId) {
  try {
    const drive = google.drive({ version: "v3", auth });
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: "name, mimeType",
    });
    if (fileInfo.data.mimeType !== "application/pdf") {
      throw new Error("File is not a PDF");
    }
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInfo.data.name}"`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

async function viewFile(res, fileId) {
  try {
    const drive = google.drive({ version: "v3", auth });
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: "name, mimeType",
    });
    if (fileInfo.data.mimeType !== "application/pdf") {
      throw new Error("File is not a PDF");
    }
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );
    res.setHeader("Content-Type", fileInfo.data.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileInfo.data.name}"`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

async function updateRemarkFile(id, remark) {
  try {
    const file = await model.updateRemarkFile(id, remark);
    return file[0];
  } catch (err) {
    throw err;
  }
}

async function updateStatusFile(id, status) {
  try {
    const file = await model.updateStatusFile(id, status);
    return file[0];
  } catch (err) {
    throw err;
  }
}

async function updateTypeFile(id, type) {
  try {
    const file = await model.updateTypeFile(id, type);
    return file[0];
  } catch (err) {
    throw err;
  }
}

async function numFilesPerDay(userID, role) {
  try {
    let result;
    if (role === "Admin") {
      result = await model.numFilesPerDayAdmin();
    } else {
      const realID = await getClientIDOrEmployeeIDByUserID(userID);
      if (realID[0].client_id) {
        result = await model.numFilesPerDayClient(userID);
      } else {
        result = await model.numFilesPerDayEmployee(userID);
      }
    } 
    const filledData = fillMissingDates(result.map((row) => ({
      date: row.date.toISOString().split("T")[0],
      count: row.count,
    })));
    return filledData;
  } catch (err) {
    throw err;
  }
}

function fillMissingDates(data) {
  const filledData = {};
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (
    let d = new Date(thirtyDaysAgo);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const dateString = d.toISOString().split("T")[0];
    filledData[dateString] = 0;
  }

  data.forEach((item) => {
    filledData[item.date] = item.count;
  });

  return Object.entries(filledData).map(([date, count]) => ({ date, count }));
}

async function numberFilesTypes(userID, role) {
  try {
    let numFiles;
    if (role == "Admin") {
      numFiles = await model.numberFilesTypesAdmin();
      return numFiles[0];
    }
    const realID = await getClientIDOrEmployeeIDByUserID(userID);
    if (realID[0].client_id) {
      const result = await model.numberFilesTypesClient(userID);
      numFiles = result;
    } else {
      const result = await model.numberFilesTypesEmployee(userID);
      numFiles = result;
    }
    return numFiles[0];
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesAndStatus(userID, role) {
  try {
    let numFiles;
    if (role == "Admin") {
      numFiles = await model.numberFilesTypesAndStatusAdmin();
    } else {
      const realID = await getClientIDOrEmployeeIDByUserID(userID);
      if (realID[0].client_id) {
        const result = await model.numberFilesTypesAndStatusClient(userID);
        numFiles = result;
      } else {
        const result = await model.numberFilesTypesAndStatusEmployee(userID);
        numFiles = result;
      }
    }
    const formattedResult = {};
    numFiles[0].forEach((row) => {
      if (!formattedResult[row.type]) {
        formattedResult[row.type] = {
          type: row.type,
          total: 0,
          pending: 0,
          completed: 0,
          inProgress: 0,
        };
      }
      formattedResult[row.type][row.status.toLowerCase()] = row.count;
      formattedResult[row.type].total += row.count;
    });

    return Object.values(formattedResult);
  } catch (err) {
    throw err;
  }
}

async function getStatus(userID, role) {
  try {
    let status;
    if (role == "Admin") {
      status = await model.getStatusAdmin();
      return status[0];
    }
    const realID = await getClientIDOrEmployeeIDByUserID(userID);
    if (realID[0].client_id) {
      const result = await model.getStatusClient(userID);
      status = result;
    } else {
      const result = await model.getStatusEmployee(userID);
      status = result;
    }
    return status[0];
  } catch (err) {
    throw err;
  }
}

async function getPending(userID) {
  try {
    const result = await model.getPendingFilesByEmployee(userID);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function countTypeFile(type, userID) {
  try {
    const realID = await getClientIDOrEmployeeIDByUserID(userID);
    if (realID[0].client_id) {
      const result = await model.countTypeFileByClientID(type, userID);
      return result[0];
    } else {
      const result = await model.countTypeFileByEmployeeID(type, userID);
      if (!result[0]) {
        return { employeeID: userID, count: 0 };
      }
      return result[0];
    }
  } catch (err) {
    throw err;
  }
}

async function listIDsFiles(userID) {
  try {
    const files = await model.getFilesIDByClientID(userID);
    const filteredFiles = files.filter((file) => file.id !== null);
    return filteredFiles;
  } catch (error) {
    throw error;
  }
}

async function listIDsFilesType(userID, type) {
  try {
    const files = await model.getFilesIDByClientIDType(userID, type);
    const filteredFiles = files.filter((file) => file.id !== null);
    return filteredFiles;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  countTypeFile,
  listFiles,
  uploadFile,
  deleteAllFiles,
  downloadFile,
  listIDsFiles,
  listIDsFilesType,
  viewFile,
  updateRemarkFile,
  updateStatusFile,
  updateTypeFile,
  getPending,
  getStatus,
  numberFilesTypes,
  numberFilesTypesAndStatus,
  numFilesPerDay,
};
