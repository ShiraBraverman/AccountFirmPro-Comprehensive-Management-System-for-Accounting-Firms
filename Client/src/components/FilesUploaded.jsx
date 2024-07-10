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

function FilesUploaded({ clientId }) {
  const { user, toasting } = useContext(AuthContext);
  const [numFilesPerDay, setNumFilesPerDay] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && user.id) {
      fetchFilesPerDay();
    }
  }, [, user]);

  const fetchFilesPerDay = async () => {
    try {
      const ownerId = clientId ? clientId : user.id;
      const response = await fetch(
        `http://localhost:3000/files/number-files-uploaded-per-day?id=${ownerId}`,
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
      const today = new Date().toISOString().split("T")[0];
      const newYearDate = "2024-01-01";

      const filteredData = data
        .filter((item) => item.count > 0)
        .map((item) => ({
          ...item,
          date: new Date(item.date).toISOString().split("T")[0],
        }));

      const hasToday = filteredData.some((item) => item.date === today);
      const hasNewYear = filteredData.some((item) => item.date === newYearDate);

      if (!hasToday) {
        filteredData.push({ date: today, count: 0 });
      }
      if (!hasNewYear) {
        filteredData.push({ date: newYearDate, count: 0 });
      }

      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setNumFilesPerDay(filteredData);
    } catch (error) {
      toasting(
        "error",
        "Error fetching files per day:" + error.message ? error.message : error
      );
    }
  };

  const lineData = {
    labels: numFilesPerDay.map((item) => item.date),
    datasets: [
      {
        label: t("Files Uploaded"),
        data: numFilesPerDay.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("Files Uploaded per Day")}</h3>
      </div>
      <Line className="canvas" data={lineData} />
    </div>
  );
}

export default FilesUploaded;
