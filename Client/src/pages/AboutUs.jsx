import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

import "../css/aboutUs.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

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
      setError("The email was sent successfully");
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
      <div className="content-wrapper">
        <MDBContainer fluid className="main-content">
          <MDBRow>
            <MDBCol md="6" className="text-content">
              <div className="header1">
                <img
                  className="logo"
                  src="../src/pictures/FullLogo-removebg-preview.png"
                  alt="Company Logo"
                />
                <div className="nav-buttons">
                  {/* <MDBBtn className="nav-btn square-btn">שפה</MDBBtn> */}
                  <Link to="/signin">
                    <MDBBtn className="nav-btn square-btn">כניסה</MDBBtn>
                  </Link>

                </div>
              </div>
              <h1 className="h1">משרד רואי חשבון, יועצי מס והנהלת חשבונות</h1>
              <p className="pAbout">
                משרד רואי החשבון שקרון בק ושות' מעניק שירות לעסקים, עמותות
                ומלכ"רים, חברות ותאגידים. למשרד מגוון מחלקות מקצועיות הנותנות
                מענה לכלל צרכי הלקוח בתחום ראיית החשבון
              </p>
              <p className="piska">
                כגון: מחלקת ביקורת הכוללת בקורת דוחות כספיים, בקורת פנים הכוללת
                איתור נקודות חולשה בעסק והצעות לפתרונן, בניית מערך בקרה פנימית
                הולם וייעוץ ארגוני לייעול הבקרה הפנימית של העסק. מחלקת מיסים
                הכוללת מיסוי שוטף, מיסוי נדל"ן, מיסוי שוק ההון, מיסוי חברות,
                ייצוג בפני רשויות המס השונות (מס הכנסה, מע"מ ועוד) תכנוני מס
                וליווי וייעוץ במיסוי הפרט. מחלקת הנהלת חשבונות ומחלקת שכר וכן
                ייעוץ כלכלי ועסקי הכולל לווי והכוונת עסקים צעירים ומיזמים חדשים,
                ייעוץ מול הבנקים, בחינת תזרימי מזומנים ותכנון אסטרטגי-עסקי,
                ליווי בנושאי הקמת תשתיות למחלקת הנהלת החשבונות והשכר. מחלקת
                ביקורות שכר ומתן מענה מול זרוע העבודה במשרד הכלכלה. ביקורת שכר
                בהתאם לתקנות בודק השכר עם התמחות בענפי השמירה, נקיון והסעדה
              </p>
              <MDBRow className="mtmargim">
                <MDBCol
                  md="6"
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="services-list">
                    <div className="services-column">
                      <p className="lilist">הנהלת חשבונות</p>
                      <p className="lilist">ביקורת שכר</p>
                      <p className="lilist">ביקורת פנים</p>
                      <p className="lilist">ביקורת דוחות כספיים</p>

                    </div>
                    <div className="services-column">
                      <p className="lilist">עמותות ומלכ״רים</p>
                      <p className="lilist">ייעוץ מיסוי</p>
                      <p className="lilist">חשבות שכר</p>
                      <p className="lilist">ייעוץ עסקי</p>

                    </div>
                  </div>
                </MDBCol>
                <MDBCol md="6">
                  <div className="contact-form">
                    <h2>ליצירת קשר</h2>
                    <form onSubmit={sendEmail}>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput
                            label="שם"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            label="טלפון"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </MDBCol>
                      </MDBRow>
                      <div className="margin"> <MDBInput
                        label="אימייל"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      /></div>
                      <div className="margin"><MDBInput
                        label="איך נוכל לעזור?"
                        type="textarea"
                        rows="3"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      /></div>
                      <MDBBtn type="submit">שלח</MDBBtn>
                      {error && <p className="error" style={{ color: error != "The email was sent successfully" ? "red" : "green" }}>{error}</p>}
                    </form>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <MDBCol md="6" className="image-content">
              <img
                src="../src/pictures/Vector 2.png"
                alt="Office Image"
                className="office-image"
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
