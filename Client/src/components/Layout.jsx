import React, { useRef, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

function Layout({ children, isUploading }) {
  // useEffect(() => {
  //   if (navbarRef.current) {
  //     const updateNavbarHeight = () => {
  //       document.documentElement.style.setProperty(
  //         "--navbar-height",
  //         `${navbarRef.current.offsetHeight}px`
  //       );
  //     };

  //     updateNavbarHeight();

  //     window.addEventListener("resize", updateNavbarHeight);
  //     return () => window.removeEventListener("resize", updateNavbarHeight);
  //   }
  // }, [navbarRef]);

  return (
    <div>
      <Navbar isUploading={isUploading} />
      <main className="main">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
