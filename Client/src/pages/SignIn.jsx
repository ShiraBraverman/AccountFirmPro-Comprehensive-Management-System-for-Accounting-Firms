import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../css/login.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";

function SignIn() {
  const { signIn } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  // const [userName, setUserName] = useState("");
  // const [userName, setUserName] = useState("DanaGoldstein");
  // const [password, setPassword] = useState("4");
  const [userName, setUserName] = useState("IdanNaim");
  const [password, setPassword] = useState("20");
  //  const [userName, setUserName] = useState("NadavLevy");
  // const [password, setPassword] = useState("11");
  // const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!userName || !password) {
      setLoginError("Please fill in all fields.");
      return;
    }
    try {
      await signIn(userName, password);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol lg="8">
          <MDBCard style={{ maxWidth: "600px" }}>
            {/* <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp"
              alt="Sample photo"
            /> */}
            <MDBCardImage 
         src="../../src/pictures/backGround.png"               className="w-100 rounded-top"
        alt='logo' fluid />

            <MDBCardBody className="px-5">
              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">
                {t("Sign in")}
              </h3>
              <MDBInput
                wrapperClass="mb-4"
                label="user Name"
                id="form1"
                type="email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <MDBBtn className="mb-4 w-100" onClick={handleLogin}>
                {t("Sign in")}
              </MDBBtn>
              {loginError && (
                <p className="error" style={{ color: "red" }}>
                  {loginError}
                </p>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
export default SignIn;
