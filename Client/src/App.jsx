import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutUs from "./pages/AboutUs.jsx";
// import AboutUs from "./pages/AboutUsFull.jsx";
import SignIn from "./pages/SignIn.jsx";
import { AuthProvider, AuthContext } from "./AuthContext";
import NestedRoutes from "./components/NestedRoutes.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./helpers/config-i18n.js";
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/aboutUs" />;
}

function App() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
        <Toaster />
          <Routes>
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout isUploading={isUploading}>
                    <NestedRoutes
                      isUploading={isUploading}
                      setIsUploading={setIsUploading}
                    />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </I18nextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
