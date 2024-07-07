import React, { useState, useEffect, useContext } from "react";
// import UserDetails from "./UserDetails";
import { AuthContext } from "../AuthContext";
import Client from "../components/Client";

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState("");
  useEffect(() => {
    if (user && user.id) {

      fetch(`http://localhost:3000/clients/clients?id=${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => setFetchError(error.message));
    }
  }, [user]);

  // if (users.length === 0)
  // setFetchError("No clients found");

  // const handleUserClick = (user) => {
  //   setSelectedUser(user);
  // };

  return (
    <div className="clients">
      {/* <h2>Clients List</h2> */}
      {fetchError && (
        <p className="error" style={{ color: "red" }}>
          {fetchError}
        </p>
      )}
      {users.name}
      <div className="allClients">
        {users &&
          users.map((user) => (
            <Client key={user.userID} client={user} />
            // <h2>{user.client_id}</h2>
          ))}
      </div>
      {/* {selectedUser && <UserDetails user={selectedUser} />} */}
    </div>
  );
};

export default UsersList;
