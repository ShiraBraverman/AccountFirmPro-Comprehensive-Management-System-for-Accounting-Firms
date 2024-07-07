import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "../css/typeFile.css";
const TypeFile = ({
  typeFile,
  setCurrentTypeFile,
  onFileDrop,
  ownerOfFiles,
  serverFiles,
  isUploading,
}) => {
  const [countOfType, setCountOfType] = useState(0);

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
    } catch (err) {
      console.log(err);
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
      <p className="num-files">{countOfType.count} files</p>
      <hr></hr>
    </div>
  );
};

export default TypeFile;
