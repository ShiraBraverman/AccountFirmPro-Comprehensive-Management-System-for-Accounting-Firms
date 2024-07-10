import React from "react";
import { MdOutlineMail } from "react-icons/md";

function Footer() {
  return (
    <footer className="footer">
      <p className="buttomtext">
        02-6237600 <img className="vectorIcon10" alt="" src="../../src/pictures/phone.svg" />
      </p>
      <p className="buttomtext">
        yael.b@c-b-cpa.co.il <MdOutlineMail />
      </p>
      <p className="buttomtext">
        הכתובת: יעבץ 2, ירושלים <img className="vectorIcon10" alt="" src="../../src/pictures/globus.svg" />
      </p>
    </footer>
  );
}

export default Footer;