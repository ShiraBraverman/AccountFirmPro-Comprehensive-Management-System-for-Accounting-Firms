import React, { useState, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import SignIn from "./pages/SignIn.jsx";
import { AuthProvider, AuthContext } from "./AuthContext";
import NestedRoutes from "./components/NestedRoutes.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/aboutUs" />;
}

function App() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
