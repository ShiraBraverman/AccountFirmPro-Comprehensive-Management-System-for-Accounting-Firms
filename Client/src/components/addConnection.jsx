import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AddConnection = ({
  selectedClient,
  selectedEmployee,
  clients,
  currentClients,
  employees,
  currentEmployees,
  isModalOpenAdd,
  isModalOpenDelete,
  setIsModalOpenAdd,
  onChange,
  setOnChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [triyngToAdd, setTriyngToAdd] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    setSearchTerm("");
  }, [selectedClient, selectedEmployee]);

  useEffect(() => {
    if (selectedEmployee) {
      const filteredClients = clients.filter(
        (client) =>
          !currentClients.some((c) => c.userID === client.userID) &&
          client.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filteredClients);
    } else if (selectedClient) {
      const filteredEmployees = employees.filter(
        (employee) =>
          !currentEmployees.some((e) => e.userID === employee.userID) &&
          employee.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filteredEmployees);
    } else setSearchResults([]);
  }, [searchTerm, selectedClient, selectedEmployee]);

  const handleSearch = (event) => {
    const searchTerm1 = event.target.value.toLowerCase();
    setSearchTerm(searchTerm1);
  };

  const handleSearchItemClick = (item) => {
    setTriyngToAdd(item);
    setIsModalOpenAdd(true);
  };

  const handleConfirmAdd = async () => {
    const clientId = selectedClient
      ? selectedClient.userID
      : triyngToAdd && triyngToAdd.userID;
    const employeeId = selectedEmployee
      ? selectedEmployee.userID
      : triyngToAdd && triyngToAdd.userID;
    try {
      const response = await fetch("http://localhost:3000/connections", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeID: employeeId,
          clientID: clientId,
        }),
      });
      if (response.ok) {
        setOnChange(!onChange);
        handleModalClose();
      } else {
        handleModalClose();
      }
    } catch (error) {
      handleModalClose();
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpenAdd(false);
  };

  return (
    <div className="search_div">
      {(selectedClient || selectedEmployee) && (
        <div className="search-container">
          <FaSearch />
          <input
            type="text"
            placeholder={`Search for ${
              selectedEmployee ? "clients" : "employees"
            } to add a contact`}
            onChange={handleSearch}
            value={searchTerm}
            className="search-input"
          />
          {!isModalOpenAdd &&
            !isModalOpenDelete &&
            searchResults.length > 0 && (
              <ul className="search-results visible">
                {searchResults.map((item) => (
                  <li
                    className="search-result"
                    key={item.userID}
                    onClick={() => handleSearchItemClick(item)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
      <Modal
        isOpen={isModalOpenAdd}
        onRequestClose={handleModalClose}
        contentLabel="Confirm Connection Deletion"
        className="modal"
        overlayClassName="overlay"
      >
        <h2> {t("Confirm Connection Addition")}</h2>
        <p>
          {t("Are you sure you want to add the connection between")}
          <strong>
            {selectedClient
              ? selectedClient.name
              : triyngToAdd && triyngToAdd.name}
          </strong>
          {t("and")}
          <strong>
            {selectedEmployee
              ? selectedEmployee.name
              : triyngToAdd && triyngToAdd.name}
          </strong>
          ?
        </p>
        <button onClick={handleConfirmAdd} autoFocus>
          {t("Yes")}
        </button>
        <button onClick={handleModalClose}> {t("No")}</button>
      </Modal>
    </div>
  );
};

export default AddConnection;
