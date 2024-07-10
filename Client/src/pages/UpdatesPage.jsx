import React, { useEffect, useState, useContext, useRef } from "react";
import "../css/update.css";
import { AuthContext } from "../AuthContext.jsx";
import {
  FaFileAlt,
  FaComments,
  FaTasks,
  FaClipboardList,
} from "react-icons/fa";
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
import UpdatesContainer from "../components/UpdatesContainer.jsx";
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

function UpdatesPage() {
  const { user, toasting, chatClient, clientReady, chatsInfo } =useContext(AuthContext);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingChats, setPendingChats] = useState([]);
  const [view, setView] = useState("");
  const highlightRef = useRef(null);
  const buttonsRef = useRef([]);
  const { t } = useTranslation();

  buttonsRef.current = [];

  useEffect(() => {
    const activeButton = buttonsRef.current.find(
      (button) => button && button.dataset.view === view
    );
    if (activeButton && highlightRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = activeButton.parentElement.getBoundingClientRect();
      const offset = buttonRect.left - containerRect.left;
      highlightRef.current.style.transform = `translateX(${offset}px)`;
      highlightRef.current.style.width = `${buttonRect.width}px`;
    }
  }, [, view]);

  useEffect(() => {
    setView("fileUpdates");
  }, []);

  useEffect(() => {
    if (user && user.id && clientReady) {
      fetchPendingFiles();
    }
  }, [, chatClient, clientReady, user]);

  const fetchPendingFiles = async () => {
    if (user && (user.role == "Role 1" || user.role == "Role 2"))
      try {
        const response = await fetch(
          `http://localhost:3000/files/pending-files?id=${user.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPendingFiles(data);
      } catch (error) {
        toasting(
          "error",
          "Error fetching pending files:" + (error.message || error)
        );
      }
  };

  const fetchPendingChats = async () => {
    try {
      const chatsWithClientNames = await Promise.all(
        chatsInfo.map(async (chat) => {
          const clientResponse = await fetch(
            `http://localhost:3000/chat/name?chatID=${
              chat.chatId.split("-")[1]
            }`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          const clientData = await clientResponse.json();
          return {
            ...chat,
            clientName: clientData.name,
            userID: clientData.userID,
          };
        })
      );
      const sortedChats = chatsWithClientNames.sort(
        (a, b) => b.unreadMessagesCount - a.unreadMessagesCount
      );
      setPendingChats(sortedChats);
    } catch (error) {
      toasting("error", "Error fetching chats:" + (error.message || error));
    }
  };

  return (
    <div className="all-update">
      <div className="toggle-buttons">
        <div className="toggle-highlight" ref={highlightRef} />
        <button
          ref={(el) => (buttonsRef.current[0] = el)}
          data-view="fileUpdates"
          className={view === "fileUpdates" ? "active" : ""}
          onClick={() => setView("fileUpdates")}
        >
          <FaFileAlt className="button-icon" />
          {t("File Updates")}
        </button>
        <button
          ref={(el) => (buttonsRef.current[1] = el)}
          data-view="chatUpdates"
          className={view === "chatUpdates" ? "active" : ""}
          onClick={() => setView("chatUpdates")}
        >
          <FaComments className="button-icon" />
          {t("Chat Updates")}
        </button>
        {user && (user.role === "Role 1" || user.role === "Role 2") && (
          <button
            ref={(el) => (buttonsRef.current[2] = el)}
            data-view="fileTasks"
            className={view === "fileTasks" ? "active" : ""}
            onClick={() => setView("fileTasks")}
          >
            <FaTasks className="button-icon" />
            {t("File Tasks")}
          </button>
        )}
        <button
          ref={(el) => (buttonsRef.current[3] = el)}
          data-view="chatTasks"
          className={view === "chatTasks" ? "active" : ""}
          onClick={() => {
            setView("chatTasks");
            fetchPendingChats();
          }}
        >
          <FaClipboardList className="button-icon" />
          {t("Chat Tasks")}
        </button>
      </div>
      <UpdatesContainer
        pendingFiles={pendingFiles}
        pendingChats={pendingChats}
        view={view}
      />{" "}
    </div>
  );
}

export default UpdatesPage;
