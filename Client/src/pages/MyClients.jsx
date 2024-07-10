import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import Client from "../components/Client";

const UsersList = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
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

  return (
    <div className="clients">
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
          ))}
      </div>
    </div>
  );
};

export default UsersList;
