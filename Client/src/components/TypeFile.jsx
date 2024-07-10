import React, { useEffect, useState, useContext } from "react";
import { useDrop } from "react-dnd";
import "../css/typeFile.css";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../AuthContext";

const TypeFile = ({
  typeFile,
  setCurrentTypeFile,
  onFileDrop,
  ownerOfFiles,
  serverFiles,
  isUploading,
}) => {
  const [countOfType, setCountOfType] = useState(0);
  const { toasting } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (ownerOfFiles != null) {
      countTypes();
    }
  }, [ownerOfFiles, serverFiles]);

  const [{ isOver }, drop] = useDrop({
    accept: "FILE",
    drop: (item) => {
      onFileDrop(item.id, item.name, item.currentType, typeFile);
      countTypes();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const countTypes = async () => {
    try {
      const data = await fetch(
        `http://localhost:3000/files/type?type=${typeFile}&&clientID=${ownerOfFiles}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!data) {
        setCountOfType(0);
      } else {
        const countType = await data.json();
        setCountOfType(countType);
      }
    } catch (error) {
      toasting("error" , error.message ? error.message : error );

    }
  };

  const handleTypeFileClick = () => {
    if (!isUploading) {
      setCurrentTypeFile(typeFile);
      localStorage.setItem("selectedTypeFile", typeFile);
    }
  };

  return (
    <div ref={drop} style={{ border: isOver ? "2px solid green" : "none" }}>
      <button className="type-file-button" onClick={handleTypeFileClick}>
        <strong>{typeFile}</strong>
      </button>
      <br />
      <p className="num-files">
        {countOfType.count} {t("files")}
      </p>
      <hr></hr>
    </div>
  );
};

export default TypeFile;
