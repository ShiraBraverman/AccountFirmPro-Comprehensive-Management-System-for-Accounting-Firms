// import "../App.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuFiles } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { FaComments } from "react-icons/fa";
import chanel from "../helpers/chanels.js";
import { AuthContext } from "../AuthContext";
import { MDBBadge } from "mdb-react-ui-kit";
import chanels from "../helpers/chanels.js";
import "../css/client.css";

const Client = ({ client }) => {
  const { user, chatClient, chatsInfo } = useContext(AuthContext);
  const [messages, setMessages] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    getMessages();
  }, [chatsInfo]);

  const getMessages = async () => {
    try {
      const messages = await chanels.getUnreadMessagesForChat(
        chatsInfo,
        null,
        client.userID
      );
      // console.log(client.userID)
      // console.log(messages)
      if (messages == -1) return;
      else setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const saveMyClient = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/myClient/storeClientID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientID: client.userID }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // console.log("User details saved successfully");
    } catch (error) {
      console.error("Error saving user details:", error.message);
    }
  };

  const viewDetails = async () => {
    await saveMyClient();
    navigate(`/userDetails/${client.userID}`);
  };

  const viewFiles = async () => {
    await saveMyClient();
    localStorage.removeItem("selectedTypeFile");
    navigate(`/myFiles/${client.userID}`);
  };

  const viewChat = async () => {
    try {
      await chanel.createChatChannel(
        chatClient,
        null,
        client.userID,
        client.userName
      );
      navigate(`../chats/${client.userID}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div key={client.id} className="client">
      <h4 id=".clientDetails">
        {client.userName}
      </h4>
      <p className="clientemail">{client.email} </p>
      <button
        className="mydetails btn-primary position-relative mx-3"
        onClick={viewDetails}
      >
        <ImProfile />
      </button>
      <button
        className="mydetails btn-primary position-relative mx-3"
        onClick={viewFiles}
      >
        <LuFiles />
      </button>
      {/* <button className="mydetails" onClick={viewChat}>
        <FaComments />
      </button> */}
      <button
        type="comments"
        onClick={viewChat}
        className="mydetails btn-primary position-relative mx-3"
        // style={{ backgroundColor: '#ac2bac' }}
      >
        <FaComments />
        {/* <i className='fab fa-instagram'></i> */}
        {messages != -1 && (
          <MDBBadge
            pill
            color="danger"
            className="position-absolute top-0 start-100 translate-middle"
          >
            {messages}
            {/*<span className='visually-hidden'>unread messages</span> */}
          </MDBBadge>
        )}
      </button>
    </div>
  );
};

export default Client;
