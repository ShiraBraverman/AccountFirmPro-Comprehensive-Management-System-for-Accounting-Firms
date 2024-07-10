import React, { useCallback, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import { AuthContext } from "../AuthContext.jsx";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import File from "../components/File";
import { FaSearch } from "react-icons/fa";
import { TbDragDrop } from "react-icons/tb";
import { FaSort } from "react-icons/fa6";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TypesFiles from "./TypesFiles.jsx";
import { FaRegHandPointRight } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Modal from "react-modal";
import { toast } from "react-hot-toast";

import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

function Files({ setIsUploading, isUploading }) {
  const location = useLocation();
  const { user, toasting } = useContext(AuthContext);
  const [currentTypeFile, setCurrentTypeFile] = useState(null);
  const [ownerOfFiles, setOwnerOfFiles] = useState(null);
  const [files, setFiles] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [serverFiles, setServerFiles] = useState([]);
  const [filesChanged, setFilesChanged] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(
    (location.state && location.state.name) || "");
  const [sortCriteria, setSortCriteria] = useState("dating");
  const [filteredFiles, setFilteredFiles] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentClient, setCurrentClient] = useState("?");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingIndex, setPendingIndex] = useState(null);
  const { t } = useTranslation();

  // const response = fetch("http://localhost:3000/files/deleteAllFiles", {
  //   method: "DELETE",
  //   credentials: "include",
  // });
  
  // const chanel1 =  chanels.deleteAllChats(
  //   chatClient,
  //   user.id,
  //   user.streamToken
  //   );

  useEffect(() => {
    switch (sortCriteria) {
      case "dating":
        const sortedFiles = [...serverFiles].sort((fileA, fileB) => {
          const dateA = new Date(fileA.updatedAt);
          const dateB = new Date(fileB.updatedAt);
          return dateB - dateA;
        });
        setFilteredFiles(sortedFiles);
        break;
      case "Approved":
        const ApprovedFiles = serverFiles.filter(
          (file) => file.status === "Approved"
        );
        setFilteredFiles(ApprovedFiles);
        break;

      case "Rejected":
        const RejectedFiles = serverFiles.filter(
          (file) => file.status === "Rejected"
        );
        setFilteredFiles(RejectedFiles);
        break;

      case "Pending":
        const PendingFiles = serverFiles.filter(
          (file) => file.status === "Pending"
        );
        setFilteredFiles(PendingFiles);
        break;
      case "Deleted":
        const deletedFiles = serverFiles.filter(
          (file) => file.status === "Deleted"
        );
        setFilteredFiles(deletedFiles);
        break;

      case "alphabetical":
        setFilteredFiles(
          [...serverFiles].sort((a, b) => a.name.localeCompare(b.title))
        );
        break;
      case "random":
        setFilteredFiles([...serverFiles].sort(() => Math.random() - 0.5));
        break;
      default:
        setFilteredFiles(serverFiles);
        break;
    }
  }, [sortCriteria, serverFiles]);

  useEffect(() => {
    const savedTypeFile = localStorage.getItem("selectedTypeFile");
    if (savedTypeFile && !currentTypeFile) {
      setCurrentTypeFile(savedTypeFile);
    }
  }, []);

  useEffect(() => {
    if (user && user.id !== undefined) {
      if (user.role === "Client") {
        setShowDrop(true);
        setOwnerOfFiles(user.id);
      } else {
        fetch("http://localhost:3000/myClient/getClientID", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.clientID) {
              setOwnerOfFiles(data.clientID);
              setShowDrop(true);
            } else setOwnerOfFiles(user.id);
          })
          .catch(() => {
            setOwnerOfFiles(user.id);
          });
      }
    }
  }, [user, location]);

  useEffect(() => {
    if (ownerOfFiles)
      if (ownerOfFiles == user.id) setCurrentClient(user.name);
      else {
        getClientName();
      }
  }, [ownerOfFiles]);

  useEffect(() => {
    if (ownerOfFiles && user.id != undefined && currentTypeFile) {
      loadFiles();
    }
  }, [ownerOfFiles, filesChanged, currentTypeFile]);

  useEffect(() => {
    if (uploadStatus == "uploading files...") setIsUploading(true);
    else setIsUploading(false);
  }, [uploadStatus]);

  const onDrop = useCallback((ApprovedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...ApprovedFiles]);
  }, []);

  const onDropRejected = useCallback((rejectedFiles) => {
    setRejectedFiles(rejectedFiles);
  }, []);

  const getClientName = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/user?id=${ownerOfFiles}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const client = await response.json();
        setCurrentClient(client.name);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toasting("error", error.message ? error.message : error);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("uploaderID", user.id);
    formData.append("clientID", ownerOfFiles);
    formData.append("typeFile", currentTypeFile);
    formData.append("filesNames", files.map((file) => file.name).join(","));
    setUploadStatus("uploading files...");
    axios
      .post("http://localhost:3000/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.statusText == "OK") {
          setUploadStatus("Files uploaded successfully");
          setFiles([]);
          loadFiles();
        }
      })
      .catch((error) => {
        setUploadStatus(error.response.data);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [],
    },
    multiple: true,
  });

  const loadFiles = async () => {
    axios
      .get(`http://localhost:3000/files`, {
        params: {
          userID: ownerOfFiles,
          typeFile: currentTypeFile,
        },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setServerFiles(response.data);
        if (response.data.length == 0) {
          setUploadStatus("This client has no files");
        }
      })
      .catch((error) => {
        setUploadStatus(error.response.data.message);
      });
  };
  // קבל את הקבצים הנוכחיים להצגה על פי העמוד הנוכחי
  const getCurrentFiles = () => {
    if (filteredFiles) {
      const endIndex = currentPage * 7;
      return filteredFiles.slice(0, endIndex);
    }
    return [];
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== pendingIndex));
  };

  const confirmNotUpload = async () => {
    handleDelete();
    setPendingIndex(null);
    setIsModalOpen(false);
  };

  const cancelNotUpload = () => {
    setPendingIndex(null);
    setIsModalOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page_files">
        <TypesFiles
          setCurrentTypeFile={setCurrentTypeFile}
          currentTypeFile={currentTypeFile}
          filesChanged={filesChanged}
          setFilesChanged={setFilesChanged}
          ownerOfFiles={ownerOfFiles}
          serverFiles={serverFiles}
          isUploading={isUploading}
        />
        {currentTypeFile ? (
          <div>
            {showDrop && (
              <div>
                <div
                  className="draganddrop"
                  {...getRootProps()}
                  style={{
                    pointerEvents:
                      uploadStatus == "uploading files..." ? "none" : "auto",
                    opacity: uploadStatus == "uploading files..." ? 0.5 : 1,
                  }}
                >
                  <input {...getInputProps()} multiple />
                  <p>
                    <TbDragDrop />
                    {t(
                      "Drag 'n' drop PDF files here, or click to select files"
                    )}
                  </p>
                </div>
                {files.length > 0 && (
                  <div>
                    <div className="files-container">
                      <h4>{t("Files to be uploaded:")}</h4>
                      <ul>
                        {files.map((file, index) => (
                          <div key={index} className="file-box">
                            <span className="file-name">
                              {file.path || file.name}
                            </span>
                            <button
                              className="delete"
                              onClick={() => {
                                setPendingIndex(index);
                                setIsModalOpen(true);
                              }}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        ))}
                      </ul>
                    </div>
                    {uploadStatus != "uploading files..." ? (
                      <button className="upload-btn" onClick={handleUpload}>
                        {t("Upload")}
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
                {rejectedFiles.length > 0 && (
                  <div>
                    <h4>{t("Rejected files:")}</h4>
                    <ul>
                      {rejectedFiles.map(({ file, errors }, index) => (
                        <li key={index}>
                          {file.path || file.name} -{" "}
                          {errors.map((e) => e.message).join(", ")}
                        </li>
                      ))}
                    </ul>
                    <p>{t("Only PDF files are allowed.")}</p>
                  </div>
                )}
              </div>
            )}
            {uploadStatus && <p>{uploadStatus}</p>}
            <div className="filesTitle">
              {currentClient && (
                <h5 className="yourFiles">
                  {currentClient}
                  {t("'s files:")}
                </h5>
              )}

              <div className="search-bar">
                <FaSearch />
                {/* <label className="input">Search:</label> */}
                <input
                  type="text"
                  value={searchCriteria}
                  placeholder="Search"
                  onChange={(event) => setSearchCriteria(event.target.value)}
                />
              </div>
            </div>
            <div className="search-bar">
              {/* <LiaSortSolid /> */}
              <FaSort />

              {/* <label className="input">Sort by:</label> */}
              <select
                className="inputItem select"
                id="sortSelect"
                value={sortCriteria}
                onChange={(event) => {
                  setSortCriteria(event.target.value);
                }}
              >
                <option value="dating">{t("dating")}</option>
                <option value="Pending">{t("Pending")}</option>
                <option value="Rejected">{t("Rejected")}</option>
                <option value="Approved">{t("Approved")}</option>
                <option value="alphabetical">{t("Alphabetical")}</option>
                <option value="random">{t("random")}</option>
              </select>
            </div>
            <div className="files">
              {getCurrentFiles().map((file, index) => (
                <File
                  key={file.id}
                  file={file}
                  searchCriteria={searchCriteria}
                  filesChanged={filesChanged}
                  setFilesChanged={setFilesChanged}
                />
              ))}
            </div>
            {filteredFiles.length > currentPage * 7 ? (
              <button className="load-more-btn" onClick={handleLoadMore}>
                {t("Load More Files")} ({filteredFiles.length - currentPage * 7}{" "}
                {t("remaining")})
              </button>
            ) : (
              <p>{t("There are no more files to load.")}</p>
            )}{" "}
          </div>
        ) : (
          <div className="hand">
            {t("turn in the 3 points on the side")}
            <br />
            <FaRegHandPointRight />
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={cancelNotUpload}
          contentLabel="Confirm File Drop"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>{t("Are you sure?")}</h2>
          <p>
            {t("Are you sure you don't want to upload the file")}{" "}
            <strong>{pendingIndex}</strong> ?
          </p>
          <button onClick={confirmNotUpload} autoFocus>
            {t("Yes")}
          </button>
          <button onClick={cancelNotUpload}>{t("No")}</button>
        </Modal>
      </div>
    </DndProvider>
  );
}

export default Files;
