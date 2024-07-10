import React, { useEffect, useState, useContext } from "react";
import "../css/update.css";
import { AuthContext } from "../AuthContext";
import { Pie } from "react-chartjs-2";
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

function MessageCount() {
  const { chatClient, clientReady, chatsInfo } = useContext(AuthContext);
  const [chatMessageCounts, setChatMessageCounts] = useState({low: 0, medium: 0, high: 0});
  const { t } = useTranslation();

  useEffect(() => {
    if (clientReady && chatsInfo) {
      setChatMessageCounts(processChatMessageCounts());
    }
  }, [clientReady, chatClient, chatsInfo]);

  const processChatMessageCounts = () => {
    const categoryCounts = { low: 0, medium: 0, high: 0 };

    Object.values(chatsInfo).forEach((chat) => {
      const totalMessages = chat.totalMessagesCount;
      if (totalMessages <= 10) {
        categoryCounts.low++;
      } else if (totalMessages <= 50) {
        categoryCounts.medium++;
      } else {
        categoryCounts.high++;
      }
    });

    return categoryCounts;
  };

  const chatCountPieData = {
    labels: [
      t("Few Messages (0-10)"),
      t("Medium Messages (11-50)"),
      t("Many Messages (51+)"),
    ],
    datasets: [
      {
        data: [
          chatMessageCounts.low,
          chatMessageCounts.medium,
          chatMessageCounts.high,
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("Chat Distribution by Message Count")}</h3>
      </div>
      <Pie
        className="canvas"
        data={chatCountPieData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Chats by Message Volume",
            },
          },
        }}
      />
    </div>
  );
}

export default MessageCount;
