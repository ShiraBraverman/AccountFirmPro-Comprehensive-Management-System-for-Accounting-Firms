import React, { useRef, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

function Layout({ children, isUploading }) {
  return (
    <div>
      <Navbar isUploading={isUploading} />
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;
