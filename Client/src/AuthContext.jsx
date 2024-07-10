import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { toast } from "react-hot-toast";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [chatClient, setChatClient] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const [chatsInfo, setChatsInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
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
    if (user && user.id && clientReady) {
      chatsData();
    }
  }, [clientReady, user]);

  const chatsData = async () => {
    await fetchAllChatsInfo();
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
    try {
      const filters = { members: { $in: [`user-${user.id}`] } };
      const sort = { last_message_at: -1 };
      const channels = await chatClient.queryChannels(filters, sort, {
        limit: 15,
        state: true,
        watch: true,
        presence: true,
      });

      const allChatsInfo = await Promise.all(
        channels.map(async (channel) => {
          const messages = await channel.query({
            messages: { limit: 100, state: true, watch: true, presence: true },
          });

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
      console.log(allChatsInfo)
      setChatsInfo(allChatsInfo);
    } catch (err) {
      toasting("error", err.message? err.message: err);
    }
  };

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
      toasting("error", err.message? err.message: err);
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

  const signUp = async (userName, password, employeeType, userRole) => {
    try {
      const response = await fetch(`http://localhost:3000/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password, employeeType, userRole }),
      });
      const data = await response.json();
      if (response.ok) {
        throw new Error("User successfully created");
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

  const toasting = async (type, message) => {
    switch (type) {
      case "error":
        toast.error(message.message ? message.message : message);
        break;
    }
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
        toasting,
      }}
    >
      {user === undefined ? null : children}
    </AuthContext.Provider>
  );
};
