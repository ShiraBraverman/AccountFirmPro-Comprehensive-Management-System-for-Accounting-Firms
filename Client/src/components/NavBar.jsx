import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";
import { CgProfile } from "react-icons/cg";
import "../css/navBar.css";
import { MDBBadge } from "mdb-react-ui-kit";
import chanels from "../helpers/chanels.js";
import { useTranslation } from "react-i18next";
import AudioPlayer from "./AudioPlayer";

function Navbar({ isUploading }) {
  const { user, chatsInfo } = useContext(AuthContext);
  const [newMessages, setNewMessages] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getMessages();
  }, [chatsInfo]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getMessages = async () => {
    try {
      const messages = await chanels.getChatsWithUnreadMessages(
        chatsInfo,
        null,
        user.id
      );
      setNewMessages(messages);
    } catch (error) {
      console.log(
        "Error fetching messages:" + error.message ? error.message : error
      );
    }
  };

  const preventLink = (e) => {
    e.preventDefault();
  };

  const clearClientID = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/myClient/clearClientID",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`status: ${response.status}`);
      }
    } catch (error) {
      console.log(
        "Error clearing ClientID from session:" + error.message
          ? error.message
          : error
      );
    }
  };

  const clearCurrentChat = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/chat/clearChatIDFromSession",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`status: ${response.status}`);
      }
    } catch (error) {
      console.log(
        "Error clearing clearChatIDFromSession from session:" + error.message
          ? error.message
          : error
      );
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("selectedTypeFile");
  };

  const handleLinkClick = (e, func1, func2, func3) => {
    if (isUploading) {
      e.preventDefault();
      window.open(e.target.href, "_blank");
    } else {
      if (func1) func1();
      if (func2) func2();
      if (func3) func3();
    }
  };

  return (
    <nav>
      <a href="#" onClick={preventLink}>
        <CgProfile /> {t("Hello")} {user.name} - {user.role}
      </a>
      <div className="language-selector">
        <select
          className="lang"
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="he">עברית</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <Link
        to="./updates"
        onClick={(e) =>
          handleLinkClick(e, clearClientID, clearLocalStorage, clearCurrentChat)
        }
      >
        {t("Updates")}
      </Link>
      <Link
        className="  position-relative mx-3"
        to="./chats"
        onClick={(e) => handleLinkClick(e, clearCurrentChat)}
      >
        {t("Chats")}
        <MDBBadge
          pill
          color="danger"
          className="position-absolute top-0 start-100 translate-middle"
        >
          {newMessages}{" "}
        </MDBBadge>
      </Link>
      {user.role != "Client" && (
        <Link to="./addUser" onClick={(e) => handleLinkClick(e)}>
          {t("Add User")}
        </Link>
      )}
      {user.role != "Client" && (
        <Link to="./myClients" onClick={(e) => handleLinkClick(e)}>
          {t("My Clients")}
        </Link>
      )}
      {user.role == "Admin" && (
        <Link to="./adminDashboard">{t("Admin Dashboard")}</Link>
      )}
      <Link
        to="./userDetails"
        onClick={(e) => handleLinkClick(e, clearClientID)}
      >
        {t("My Details")}
      </Link>
      {user.role != "Admin" && (
        <Link
          to="./myFiles"
          className={!user ? "disabled" : ""}
          onClick={(e) => handleLinkClick(e, clearClientID, clearLocalStorage)}
        >
          {t("My Files")}
        </Link>
      )}
      <Link
        to="./logout"
        onClick={(e) => handleLinkClick(e)}
        className={!user ? "disabled" : ""}
      >
        {t("Logout")}
      </Link>
      <img id="logo" src="../../src/pictures/RoundLogo.png" alt="logo" />
      {/* <AudioPlayer language={i18n.language} /> */}
    </nav>
  );
}

export default Navbar;
