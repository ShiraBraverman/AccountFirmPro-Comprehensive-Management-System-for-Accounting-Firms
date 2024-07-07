import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const deleteConnection = ({
  selectedClient,
  selectedEmployee,
  triyngToDelete,
  setTriyngToDelete,
  userToDelete,
  isModalOpenDelete,
  setIsModalOpenDelete,
  currentClientsemployees,
  onChange,
  setOnChange,
}) => {
  const handleConfirmDelete = async () => {
    const connection = currentClientsemployees.find(
      (c) =>
        c.client_user_id ===
          (selectedClient
            ? selectedClient.userID
            : userToDelete && userToDelete.userID) &&
        c.employee_user_id ===
          (selectedEmployee
            ? selectedEmployee.userID
            : userToDelete && userToDelete.userID)
    );
    try {
      const response = await fetch("http://localhost:3000/connections", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeID: connection.employee_id,
          clientID: connection.client_id,
        }),
      });
      if (response.ok) {
        setOnChange(!onChange);
        handleModalClose();
      } else {
        // console.log(response);
        handleModalClose();
      }
    } catch (error) {
      console.log(error);
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setTriyngToDelete("");
    setIsModalOpenDelete(false);
  };

  const handleDeleteConnection = async () => {
    if (triyngToDelete != "") setTriyngToDelete("");
    else {
      if (selectedClient) setTriyngToDelete("Client");
      if (selectedEmployee) setTriyngToDelete("Employee");
    }
  };

  return (
    <div className="div_to_delete">
      {selectedClient && (
        <button onClick={handleDeleteConnection} className="delete-button">
          Click on me and choose a employee to delete{" "}
        </button>
      )}
      {selectedEmployee && (
        <button onClick={handleDeleteConnection} className="delete-button">
          Click on me and choose a client to delete{" "}
        </button>
      )}
      <Modal
        isOpen={isModalOpenDelete}
        onRequestClose={handleModalClose}
        contentLabel="Confirm Connection Deletion"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Connection Deletion</h2>
        <p>
          Are you sure you want to delete the connection between{" "}
          <strong>
            {selectedClient
              ? selectedClient.name
              : userToDelete && userToDelete.name}
          </strong>{" "}
          and{" "}
          <strong>
            {selectedEmployee
              ? selectedEmployee.name
              : userToDelete && userToDelete.name}
          </strong>
          ?
        </p>
        <button onClick={handleConfirmDelete} autoFocus>
          Yes
        </button>
        <button onClick={handleModalClose}>No</button>
      </Modal>
    </div>
  );
};

export default deleteConnection;
