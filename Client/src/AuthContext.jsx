import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import axios from "axios";
import chanels from "./helpers/chanels";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [chatClient, setChatClient] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const [chatsInfo, setChatsInfo] = useState([]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    return disconnectClient;
  }, []);

  useEffect(() => {
    if (apiKey) {
      setChatClient(StreamChat.getInstance(apiKey));
    }
  }, [apiKey]);

  useEffect(() => {
    if (user && user.id) {
      getApiKey();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.streamToken && apiKey) {
      setupClient();
    }
  }, [user, chatClient]);

  useEffect(() => {
    if (clientReady) {
      chatsData();
    }
  }, [clientReady, user]);

  const chatsData = async () => {
    await fetchAllChatsInfo();
    // await loadFilesAndUpdateChats(user.id);
  };
  const disconnectClient = async () => {
    if (clientReady) {
      chatClient.disconnectUser();
    }
  };

  const setupClient = async () => {
    const userId = `user-${user.id}`;
    const userToken = user.streamToken;
    await chatClient.connectUser(
      {
        id: userId,
      },
      userToken
    );
    setClientReady(true);
  };

  const fetchAllChatsInfo = async () => {
    if (!clientReady || !chatClient || !user) return;

    try {
      const filters = { members: { $in: [`user-${user.id}`] } };
      const sort = { last_message_at: -1 };
      const channels = await chatClient.queryChannels(filters, sort, {});

      const allChatsInfo = await Promise.all(
        channels.map(async (channel) => {
          const messages = await channel.query({ messages: { limit: 500 } });

          const userMessagesCount = messages.messages.filter(
            (message) => message.user.id === `user-${user.id}`
          ).length;

          const otherMessagesCount = messages.messages.filter(
            (message) => message.user.id !== `user-${user.id}`
          ).length;

          return {
            chatId: channel.id,
            chatType: channel.type,
            chatName: channel.data.name,
            members: channel.state.members,
            userMessagesCount: userMessagesCount,
            otherMessagesCount: otherMessagesCount,
            unreadMessagesCount: channel.state.unreadCount,
            totalMessagesCount: userMessagesCount + otherMessagesCount,
            lastMessageAt: channel.state.last_message_at,
            createdAt: channel.created_at,
            createdBy: channel.created_by,
            description: channel.data.description,
          };
        })
      );
      console.log(allChatsInfo);
      setChatsInfo(allChatsInfo);
      // loadFilesAndUpdateChats(allChatsInfo, user.id);
    } catch (error) {
      console.error("Error fetching chats info:", error);
    }
  };

  // const loadFilesAndUpdateChats = async (chatsInfo, ownerOfFiles) => {
  //   try {
  //     const types = [
  //       "Current material for accounting",
  //       "Material for an annual report",
  //       "Approvals, tax coordination and miscellaneous",
  //       "Reports and information to download",
  //     ];

  //     let allFiles = [];
  //     for (const typeFile of types) {
  //       const response = await axios.get(`http://localhost:3000/files`, {
  //         params: {
  //           userID: ownerOfFiles,
  //           typeFile: typeFile,
  //         },
  //         withCredentials: true,
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       allFiles = [...allFiles, ...response.data];
  //     }
  //     setFiles(allFiles);

  //     if (allFiles.length === 0) {
  //       console.log("This client has no files");
  //     } else {
  //       const filesWithChatIDs = await Promise.all(
  //         allFiles.map(async (file) => {
  //           const chatData = await chanels.getChatID(file.id, ownerOfFiles);
  //           return { ...file, chatId: chatData ? chatData.id : null };
  //         })
  //       );
  //       const updatedChatsInfo = chatsInfo.map((chat) => {
  //         const matchingFile = filesWithChatIDs.find(
  //           (file) => `myChat-${file.chatId}` === chat.chatId
  //         );
  //         if (matchingFile) {
  //           return {
  //             ...chat,
  //             chatName: matchingFile.name || chat.chatName,
  //             description: `File Type: ${matchingFile.type}, Size: ${matchingFile.size}, Created: ${matchingFile.createdAt}`,
  //           };
  //         }
  //         return chat;
  //       });

  //       setChatsInfo(updatedChatsInfo);

  //       for (const chat of updatedChatsInfo) {
  //         if (chat.description) {
  //           const chat1 = await chatClient
  //             .channel(chat.chatType, chat.chatId)
  //             .update({
  //               name: chat.chatName,
  //               description: chat.description,
  //             });
  //         }
  //       }

  //     }
  //   } catch (error) {
  //     console.error("Error loading files and updating chats:", error);
  //   }
  // };

  const getApiKey = async () => {
    try {
      const data = await fetch(`http://localhost:3000/chat/apiKey`, {
        method: "GET",
        credentials: "include",
      });
      if (!data) {
      } else {
        const [apiKey] = await data.json();
        setApiKey(apiKey);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/checkAuth", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const userSession = await response.json();
        const data = await fetch(
          `http://localhost:3000/users/user?id=${userSession.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const user = await data.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (userName, password) => {
    try {
      const response = await fetch(`http://localhost:3000/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password }),
      });
      const userFromDB = await response.json();
      if (response.ok) {
        setUser(userFromDB);
        navigate("./updates");
      } else {
        throw new Error(
          userFromDB.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signUp = async (userName, password, employeType, role) => {
    try {
      const response = await fetch(`http://localhost:3000/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password, employeType, role }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("./updates");
      } else {
        throw new Error(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message || "An error occurred. Please try again.");
      } else {
      }
    } catch (error) {
      throw new Error(error.message);
    }
    setUser(null);
    disconnectClient();
    navigate("/aboutUs");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        logout,
        signUp,
        chatClient,
        clientReady,
        chatsInfo,
      }}
    >
      {user === undefined ? null : children}
    </AuthContext.Provider>
  );
};
