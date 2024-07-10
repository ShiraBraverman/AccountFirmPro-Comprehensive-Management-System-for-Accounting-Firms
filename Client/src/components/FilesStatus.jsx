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

function FilesStatus({clientId}) {
  const { user, toasting } = useContext(AuthContext);
  const [statusData, setStatusData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && user.id) {
      getStatus();
    }
  }, [, user]);

  const getStatus = async () => {
    try {
      const ownerId = clientId ? clientId : user.id;
      const response = await fetch(
        `http://localhost:3000/files/all-status?id=${ownerId}`,
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
      setStatusData(data);
    } catch (error) {
      toasting(
        "error",
        "Error fetching status data:" + error.message ? error.message : error
      );
    }
  };

  const statusLabels = statusData.map((status) => t(status.status));
  const statusCounts = statusData.map((status) => status.count);

  const pieData = {
    labels: statusLabels,
    datasets: [
      {
        label: t("Status Distribution"),
        data: statusCounts,
        backgroundColor: [
          "#90e290",
          "rgb(200, 200, 200)",
          "rgb(114 164 216)",
          "#d85a5a",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "#90e290",
          "rgb(178 174 174)",
          "rgb(120, 170, 230)",
          "#d85a5a",
          "rgba(160, 120, 260, 10)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("Status")}</h3>
      </div>
      <Pie className="canvas" data={pieData} />
    </div>
  );
}

export default FilesStatus;
