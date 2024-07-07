import React, { useState, useEffect } from "react";
import "../css/adminDashboard.css";
import AddConnection from "../components/addConnection";
import DeleteConnection from "../components/deleteConnection";
import { FaSearch } from "react-icons/fa";

const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [currentClients, setCurrentClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [clientsemployees, setClientsemployees] = useState([]);
  const [currentClientsemployees, setCurrentClientsemployees] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeColors, setEmployeeColors] = useState({});
  const [triyngToDelete, setTriyngToDelete] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [widthChanged, setWidthChanged] = useState(false);
  const [onChange, setOnChange] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState("");

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (widthChanged) {
      makeLines();
      setWidthChanged(false);
    }
  }, [widthChanged]);

  useEffect(() => {
    setSelectedClient(null);
    setSelectedEmployee(null);
    setTriyngToDelete("");
    setUserToDelete(null);
    fetchClients();
    fetchEmployees();
    fetchConnections();
  }, [onChange]);

  useEffect(() => {
    if (selectedClient) {
      const relatedEmployees = clientsemployees
        .filter(
          (connection) => connection.client_user_id === selectedClient.userID
        )
        .map((connection) => connection.employee_user_id);

      setCurrentEmployees(
        employees.filter((employee) =>
          relatedEmployees.includes(employee.userID)
        )
      );

      setCurrentClientsemployees(
        clientsemployees.filter(
          (connection) => connection.client_user_id === selectedClient.userID
        )
      );

      setCurrentClients([selectedClient]);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedEmployee) {
      const relatedClients = clientsemployees
        .filter(
          (connection) =>
            connection.employee_user_id === selectedEmployee.userID
        )
        .map((connection) => connection.client_user_id);

      setCurrentClients(
        clients.filter((client) => relatedClients.includes(client.userID))
      );

      setCurrentClientsemployees(
        clientsemployees.filter(
          (connection) =>
            connection.employee_user_id === selectedEmployee.userID
        )
      );

      setCurrentEmployees([selectedEmployee]);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    const colors = currentEmployees.map((employee) => ({
      id: employee.userID,
      color: getRandomColor(),
    }));
    setEmployeeColors(colors);
  }, [employees]);

  useEffect(() => {
    document
      .querySelectorAll(".relationship-line")
      .forEach((line) => line.remove());
    makeLines();
  }, [currentClientsemployees, employeeColors]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:3000/clients/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
      setCurrentClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/employees/employees",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
      setCurrentEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await fetch("http://localhost:3000/connections", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClientsemployees(data);
      setCurrentClientsemployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  const makeLines = () => {
    if (employeeColors) {
      currentClientsemployees.forEach((connectoin) => {
        const client = currentClients.find(
          (c) => c.userID === connectoin.client_user_id
        );
        const employee = currentEmployees.find(
          (e) => e.userID === connectoin.employee_user_id
        );
        if (client && employee) {
          const clientElement = document.querySelector(
            `#client-${client.userID}`
          );
          const employeeElement = document.querySelector(
            `#employee-${employee.userID}`
          );
          if (clientElement && employeeElement) {
            const clientRect = clientElement.getBoundingClientRect();
            const employeeRect = employeeElement.getBoundingClientRect();
            const clientTop =
              clientRect.top + window.scrollY + clientRect.height / 2;
            const employeeTop =
              employeeRect.top + window.scrollY + employeeRect.height / 2;

            const deltaX = employeeRect.left - clientRect.right;
            const deltaY = employeeTop - clientTop;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            const relationshipLine = document.createElement("div");
            relationshipLine.className = "relationship-line";
            relationshipLine.style.top = `${clientTop}px`;
            relationshipLine.style.left = `${clientRect.right}px`;
            relationshipLine.style.width = `${length}px`;
            relationshipLine.style.transform = `rotate(${angle}deg)`;
            relationshipLine.style.transformOrigin = "0 0";
            relationshipLine.style.zIndex = "3";
            relationshipLine.style.backgroundColor = getEmployeeColor(
              employee.userID
            );
            relationshipLine.style.borderColor = getEmployeeColor(
              employee.userID
            );
            document.body.appendChild(relationshipLine);
          }
        }
      });
    }
  };

  const highlightSearchTerm = (text) => {
    if (!text) return "למה זה קורה?";
    const lowerText = text.toLowerCase();
    const lowerSearch = searchCriteria.toLowerCase();
    const index = lowerText.indexOf(lowerSearch);
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <strong style={{ fontWeight: "bold", backgroundColor: "#ffcc80" }}>
          {text.substring(index, index + searchCriteria.length)}
        </strong>
        {text.substring(index + searchCriteria.length)}
      </>
    );
  };

  const getRandomColor = () => {
    const getByte = () =>
      Math.random() < 0.5
        ? Math.floor(Math.random() * 128)
        : 128 + Math.floor(Math.random() * 128);
    return `rgb(${getByte()}, ${getByte()}, ${getByte()}, 0.1)`;
  };

  const getEmployeeMargin = () => {
    if (currentEmployees.length >= currentClients.length) return "10px";
    const clientsLength = currentClients.length * 40;
    const employeeLength = clientsLength / currentEmployees.length;
    return `${employeeLength - 10}px`;
  };

  const getClientMargin = () => {
    if (currentEmployees.length <= currentClients.length) return "10px";
    const employesLength = currentEmployees.length * 40;
    const clientLength = employesLength / currentEmployees.length;
    return `${clientLength - 10}px`;
  };

  const getEmployeeColor = (employeeID) => {
    const employeeColor =
      employeeColors.find((e) => e.id === employeeID)?.color || "black";
    return employeeColor;
  };

  const handleClientClick = (client) => {
    setSearchCriteria("");
    if (triyngToDelete == "Employee") {
      setIsModalOpenDelete(true);
      setUserToDelete(client);
    } else {
      setTriyngToDelete("");
      setSelectedClient(client);
      setSelectedEmployee(null);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSearchCriteria("");
    if (triyngToDelete == "Client") {
      setIsModalOpenDelete(true);
      setUserToDelete(employee);
    } else {
      setTriyngToDelete("");
      setSelectedClient(null);
      setSelectedEmployee(employee);
    }
  };

  const handleResetClick = () => {
    setSelectedClient(null);
    setSelectedEmployee(null);
    setCurrentClients(clients);
    setCurrentEmployees(employees);
    setCurrentClientsemployees(clientsemployees);
    setTriyngToDelete("");
    setUserToDelete(null);
  };

  const handleResize = () => {
    document
      .querySelectorAll(".relationship-line")
      .forEach((line) => line.remove());
    if (!widthChanged) setWidthChanged(true);
  };

  return (
    <div className="admin-dashboard">
      <div className="main-content">
        {(selectedClient || selectedEmployee) && (
          <div className="reset-button-container">
            <button onClick={handleResetClick} className="reset-button">
              Show All
            </button>
          </div>
        )}
        <div className="search_div">
          <div className="search-bar">
            <FaSearch />
            {/* <label className="input">Search:</label> */}
            <input
              type="text"
              value={searchCriteria}
              placeholder="Search"
              onChange={(event) => setSearchCriteria(event.target.value)}
            />
          </div>
        </div>
        <div className="content-container">
          <div className="clients-list">
            <h3>Clients</h3>
            <ul>
              {currentClients.map((client) => (
                <li
                  onClick={() => handleClientClick(client)}
                  key={client.userID}
                  style={{
                    marginBottom: getClientMargin(),
                  }}
                >
                  <div>{highlightSearchTerm(client.name)}</div>
                  <div
                    id={`client-${client.userID}`}
                    className="circle-button"
                    style={{
                      backgroundColor:
                        triyngToDelete == "Employee" ? "red" : "#ccc",
                    }}
                  >
                    {client.name ? client.name.charAt(0) : "oooof"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="employees-list">
            <h3>Employees</h3>
            <ul>
              {currentEmployees.map((employee) => (
                <li
                  onClick={() => handleEmployeeClick(employee)}
                  key={employee.userID}
                  style={{
                    marginBottom: getEmployeeMargin(),
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        triyngToDelete == "Client"
                          ? "red"
                          : getEmployeeColor(employee.userID),
                    }}
                    id={`employee-${employee.userID}`}
                    className="circle-button"
                  >
                    {employee.name ? employee.name.charAt(0) : "oooof"}
                  </div>
                  <div>{highlightSearchTerm(employee.name)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="content-container-second">
        {selectedClient && <h2>{selectedClient.name}</h2>}
        {selectedEmployee && <h2>{selectedEmployee.name}</h2>}
        <div className="deleteConnectionContainer">
          <DeleteConnection
            selectedClient={selectedClient}
            selectedEmployee={selectedEmployee}
            triyngToDelete={triyngToDelete}
            setTriyngToDelete={setTriyngToDelete}
            userToDelete={userToDelete}
            isModalOpenDelete={isModalOpenDelete}
            setIsModalOpenDelete={setIsModalOpenDelete}
            currentClientsemployees={currentClientsemployees}
            onChange={onChange}
            setOnChange={setOnChange}
          />
        </div>
        <div className="addConnectionContainer">
          <AddConnection
            selectedClient={selectedClient}
            selectedEmployee={selectedEmployee}
            clients={clients}
            currentClients={currentClients}
            employees={employees}
            currentEmployees={currentEmployees}
            isModalOpenAdd={isModalOpenAdd}
            setIsModalOpenAdd={setIsModalOpenAdd}
            onChange={onChange}
            setOnChange={setOnChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
