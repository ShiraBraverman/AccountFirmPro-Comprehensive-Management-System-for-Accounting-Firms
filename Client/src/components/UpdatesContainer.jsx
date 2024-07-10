import React, { useContext } from "react";
import "../css/update.css";
import { AuthContext } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaComments, FaUser } from "react-icons/fa";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { useTranslation } from "react-i18next";
import MessagesOverview from "../components/MessagesOverview";
import MessagesPerDay from "../components/MessagesPerDay";
import MessageCount from "../components/MessageCount";
import FileCounts from "../components/FileCounts";
import FilesUploaded from "../components/FilesUploaded";
import FilesStatus from "../components/FilesStatus";
import chanels from "../helpers/chanels.js";
import { MDBBadge } from "mdb-react-ui-kit";

ChartJS.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement
);

function UpdatesContainer({ pendingChats, pendingFiles, view }) {
  const { toasting } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const saveMyClient = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/myClient/storeClientID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientID: id }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      toasting(
        "error",
        "Error saving user details:" + error.message ? error.message : error
      );
    }
  };

  const handleFileClick = async (event, file) => {
    event.preventDefault();
    await saveMyClient(file.clientID);
    localStorage.setItem("selectedTypeFile", file.type);
    navigate(`../myFiles/${file.clientID}`, {
      state: {
        name: file.name,
      },
    });
  };

  const handleChatClick = async (event, chat) => {
    event.preventDefault();
    await chanels.saveCurrentChat(chat.chatId.split("-")[1]);
    navigate(`../chats/${chat.chatId.split("-")[1]}`);
  };

  const renderContent = () => {
    switch (view) {
      case "fileUpdates":
        return (
          <div className="updates">
            <FileCounts />
            <FilesUploaded />
            <FilesStatus />
          </div>
        );
      case "chatUpdates":
        return (
          <div className="updates">
            <MessagesOverview />
            <MessagesPerDay />
            <MessageCount />
          </div>
        );
      case "fileTasks":
        return (
          <div className="pending-files-container">
            <h3>{t("Pending Files")}</h3>
            <div className="pending-files-grid">
              {pendingFiles &&
                pendingFiles.map((file) => (
                  <div key={file.id} className="pending-file-item">
                    <div className="file-name">
                      <FaFileAlt className="item-icon" />
                      {file.name}
                    </div>
                    <div className="client-name">
                      <FaUser className="item-icon" />
                      {file.clientName}
                    </div>
                    <div className={`file-status ${file.status.toLowerCase()}`}>
                      {t(file.status)}
                    </div>
                    <a
                      href={`http://localhost:5173/myFiles/${file.clientID}`}
                      onClick={(e) => handleFileClick(e, file)}
                      className="file-link"
                    >
                      {t("View File")}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        );
      case "chatTasks":
        return (
          <div className="pending-chats-container">
            <h3>{t("Chats")}</h3>
            <div className="pending-chats-grid">
              {pendingChats.map((chat) => (
                <div key={chat.chatId} className="pending-chat-item">
                  <MDBBadge pill color="danger" className="point">
                    {chat.unreadMessagesCount}
                  </MDBBadge>
                  <div className="file-name">
                    <FaComments className="item-icon" />
                    {t("Chat")}: {chat.chatName}
                  </div>
                  <div className="client-name">
                    <FaUser className="item-icon" />
                    {chat.clientName}
                  </div>
                  <a
                    href={`/chats/${chat.chatId}`}
                    onClick={(e) => handleChatClick(e, chat)}
                    className="chat-link"
                  >
                    {t("View Chat")}
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return renderContent();
}

export default UpdatesContainer;
