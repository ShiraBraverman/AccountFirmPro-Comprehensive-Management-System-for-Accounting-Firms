import React, { useEffect, useState, useContext } from "react";
import "../css/update.css";
import { AuthContext } from "../AuthContext";
import { Line } from "react-chartjs-2";
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

function MessagesPerDay() {
  const { chatClient, clientReady, chatsInfo } = useContext(AuthContext);
  const [messagesPerDay, setMessagesPerDay] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (clientReady && chatsInfo) {
      processMessagesPerDay();
    }
  }, [clientReady, chatClient, chatsInfo]);

  const processMessagesPerDay = () => {
    const messagesCount = {};
    Object.values(chatsInfo).forEach((chat) => {
      const date = new Date(chat.lastMessageAt).toISOString().split("T")[0];
      if (!messagesCount[date]) {
        messagesCount[date] = 0;
      }
      messagesCount[date] += chat.totalMessagesCount;
    });
    messagesCount["2024-01-01"] = 0;
    setMessagesPerDay(messagesCount);
  };

  const messageLineData = {
    labels: Object.keys(messagesPerDay).sort(),
    datasets: [
      {
        label: t("Messages per Day"),
        data: Object.keys(messagesPerDay)
          .sort()
          .map((date) => messagesPerDay[date]),
        backgroundColor: "rgba(255, 99, 132, 1)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("Messages Sent per Day")}</h3>
      </div>
      <Line className="canvas" data={messageLineData} />
    </div>
  );
}

export default MessagesPerDay;
