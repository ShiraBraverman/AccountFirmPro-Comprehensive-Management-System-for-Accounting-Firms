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

function FileCounts({ clientId }) {
  const { user, toasting } = useContext(AuthContext);
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (user && user.id) {
      getTypesAndStatus();
    }
  }, [, user]);

  const getTypesAndStatus = async () => {
    try {
      const ownerId = clientId ? clientId : user.id;
      const response = await fetch(
        `http://localhost:3000/files/number-files-by-type-and-status?id=${ownerId}`,
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
      setTypes(data);
    } catch (error) {
      toasting(
        "error",
        "Error fetching types data:" + error.message ? error.message : error
      );
    }
  };

  const barData = {
    labels: types.map((type, index) => `${t("Type")} ${index + 1}`),
    datasets: [
      {
        label: t("Pending"),
        data: types.map((type) => type?.pending),
        backgroundColor: "rgb(114 164 216)",
        borderColor: "rgb(114 164 216)",
        borderWidth: 1,
      },
      {
        label: t("Approved"),
        data: types.map((type) => type.approved),
        backgroundColor: "#90e290",
        borderColor: "#90e290",
        borderWidth: 1,
      },
      {
        label: t("Rejected"),
        data: types.map((type) => type.rejected),
        backgroundColor: "#d85a5a",
        borderColor: "#d85a5a",
        borderWidth: 1,
      },
      {
        label: t("Deleted"),
        data: types.map((type) => type.deleted),
        backgroundColor: "rgb(178 174 174)",
        borderColor: "rgb(178 174 174)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="title-div">
        <h3>{t("File Counts per Type and Status")}</h3>
      </div>
      <Bar
        className="canvas"
        data={barData}
        options={{
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              max: Math.max(...types.map((type) => type.total)) + 1,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += Math.round(context.parsed.y * 10) / 10;
                  }
                  return label;
                },
              },
            },
          },
        }}
      />
      {!clientId && (
        <div className="explanation">
          {types.map((type, index) => (
            <div className="types" key={index}>
              <strong>
                {t("Type")} {index + 1}:
              </strong>{" "}
              {t(type.type)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileCounts;
