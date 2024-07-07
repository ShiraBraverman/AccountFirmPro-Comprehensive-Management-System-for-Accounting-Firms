import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Updates from "../pages/UpdatesPage.jsx";
import SignUp from "../pages/SignUp.jsx";
import Logout from "../pages/Logout.jsx";
import Files from "../pages/Files.jsx";
import MyClients from "../pages/MyClients.jsx";
import UserDetails from "../pages/UserDetails.jsx";
import Chats from "../pages/ChatApp.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";

function NestedRoutes({ setIsUploading, isUploading }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes("adminDashboard")) {
      document
        .querySelectorAll(".relationship-line")
        .forEach((line) => line.remove());
    }
  }, [location]);
  
  return (
    <Routes location={location}>
      <Route path="/updates" element={<Updates />} />
      <Route path="/addUser" element={<SignUp />} />
      <Route path="/chats" element={<Chats/>} />
      <Route path="/chats/:id" element={<Chats/>} />
      <Route path="/myClients" element={<MyClients />} />
      <Route
        path="/myFiles"
        element={
          <Files
            key={location.key}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        }
      />
      <Route
        path="/myFiles/:id"
        element={
          <Files
            key={location.key}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        }
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="/userDetails" element={<UserDetails key={location.key} />} />
      <Route
        path="/userDetails/:id"
        element={<UserDetails key={location.key} />}
      />
      <Route path="/adminDashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default NestedRoutes;
