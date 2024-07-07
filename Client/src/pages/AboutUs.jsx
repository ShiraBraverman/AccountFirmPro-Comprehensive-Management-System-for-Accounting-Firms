import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function AboutUs() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    } else {
      setError("");
    }

    fetch(`http://localhost:3000/sendEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        subject: `name: ${name}  phone:${phone}  email:${email} `,
        text: text,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmail("");
          setName("");
          setPhone("");
          setText("");
        } else {
          setError(data.message || "error :(");
        }
      })
      .catch((error) => {
        setError("error :(" + error);
      });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="about_us">
      <div className="header_section">
        <img
          className="img_about_us"
          src="../src/pictures/FullLogo-removebg-preview.png"
          alt="Company Logo"
        />
        <Link to="/signin">
          <button className="sign_in_button">Sign In</button>
        </Link>
      </div>
      <div className="form_section">
        <div className="contact_info">
          <img
            className="img_about_us2"
            src="../src/pictures/cropped-view-professional-serious-finance-manager-holding-calculator-hands-checking-company-month-s-profits.jpg"
            alt="Office Image"
          />
        </div>
        <form onSubmit={sendEmail}>
          <label>full name</label>
          <input
            type="text"
            className="input"
            value={name}
            name="name"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
          <label>phone</label>
          <input
            type="text"
            className="input"
            value={phone}
            name="phone"
            placeholder="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          <label>email</label>
          <input
            type="text"
            className="input"
            value={email}
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>text</label>
          <textarea
            className="input"
            value={text}
            placeholder="How can we help you?"
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">send</button>
          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </form>
      </div>
      <div className="text_section">
        <h1>משרד רואי חשבון, יועצי מס והנהלת חשבונות</h1>
        <p>
          משרד רואי החשבון רודניק וורצל ושות' הוקם בשנת 1989 ומעניק שירות
          לעסקים, עמותות ומלכ"רים, חברות ותאגידים.
        </p>
        <p>
          המשרד מעניק מגוון רחב של שירותים בתחום ראיית חשבון כגון, מחלקת ביקורת
          ועריכת דוחות כספיים על פי תקני חשבונאות בינלאומיים (IFRS) והתקנים
          האמריקאיים (US GAAP), ביקורת דוחות כספיים של חברות ציבוריות הנסחרות
          בבורסות בארץ ובחו"ל, ייעוץ ותכנון מס, ביקורת פנימית, מיסוי מלכ"רים,
          חברות, מיסוי בינלאומי ועוד.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
