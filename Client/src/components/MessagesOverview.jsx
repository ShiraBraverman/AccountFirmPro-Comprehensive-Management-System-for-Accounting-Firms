import React, { useEffect, useState, useContext } from "react";
import "../css/update.css";
import { AuthContext } from "../AuthContext";
import { Bar } from "react-chartjs-2";
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

function MessagesOverview() {
  const { chatClient, clientReady, chatsInfo } = useContext(AuthContext);
  const [chatStats, setChatStats] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (clientReady && chatsInfo) {
      const stats = Object.values(chatsInfo).map((chat) => ({
        chatName: chat.chatName,
        unreadMessages: chat.unreadMessagesCount,
        userMessages: chat.userMessagesCount,
        otherMessages: chat.otherMessagesCount,
      }));
      setChatStats(stats);
    }
  }, [clientReady, chatClient, chatsInfo]);

  const shortenChatName = (name, maxLength = 15) => {
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  const chatBarData = {
    labels: chatStats
      .slice(0, 10)
      .map((chat) => shortenChatName(chat.chatName)),
    datasets: [
      {
        label: t("Unread Messages"),
        data: chatStats.slice(0, 10).map((chat) => chat.unreadMessages),
        backgroundColor: "rgba(255, 206, 86, 1)",
      },
      {
        label: t("Messages Sent"),
        data: chatStats.slice(0, 10).map((chat) => chat.userMessages),
        backgroundColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: t("Messages Received"),
        data: chatStats.slice(0, 10).map((chat) => chat.otherMessages),
        backgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("Chat Messages Overview")}</h3>
      </div>
      <Bar
        className="canvas"
        data={chatBarData}
        options={{
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
}

export default MessagesOverview;
