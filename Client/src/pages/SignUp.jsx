import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../css/signup.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { signUp, user } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [employeeType, setEmployeeType] = useState("Role 1");
  const [userRole, setUserRole] = useState("Client");
  const { t } = useTranslation();

  const handleRegistration = async () => {
    if (!userName || !password || !passwordVerify) {
      setSignUpError("Please fill in all fields.");
      return;
    }
    if (password != passwordVerify) {
      setSignUpError("The passwords are not the same.");
      return;
    }
    if (!CheckPassword(password)) return;
    try {
      await signUp(userName, password, employeeType, userRole);
    } catch (error) {
      setSignUpError(error.message);
    }
  };

  const CheckPassword = (password) => {
    // let psw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
    // if (password.match(psw)) {
    return true;
    // } else {
    //     setSignUpError('Wrong password...! The password must contain letters and numbers');
    //     return false;
    // }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol lg='8'>
          <MDBCard style={{ maxWidth: '600px' }}>
            <MDBCardImage
              src="../../src/pictures/backGround.png" className="w-100 rounded-top"
              alt='logo' fluid />       
             <MDBCardBody className='px-5'>
              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">{t("Create Account")}</h3>
              <MDBInput label='User Name' id='form1' type='text' wrapperClass='mb-4' value={userName} onChange={(e) => setUserName(e.target.value)} />
              <MDBRow>
                <MDBCol md='6'>
                  <MDBInput label='Password' id='form2' wrapperClass='datepicker mb-4' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </MDBCol>
                <MDBCol md='6' className='mb-4'>
                  <MDBInput label='Repeat your password' id='form3' type='password' value={passwordVerify} onChange={(e) => setPasswordVerify(e.target.value)} />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md='12'>
                  <div className="input-row">
                    <select
                      className="input1"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                    >
                      <option value="Client">{t("Client")}</option>
                      {user.role == "Admin" && (
                        <>
                          <option value="Employee">{t("Employee")}</option>
                          <option value="Admin">{t("Admin")}</option>
                        </>
                      )}
                    </select>
                    <br />
                    {userRole === "Employee" && (
                      <select
                        className="input1"
                        value={employeeType}
                        onChange={(e) => setEmployeeType(e.target.value)}
                      >
                        <option value="Role 1">{t("Role 1")}</option>
                        <option value="Role 2">{t("Role 2")}</option>
                      </select>
                    )}
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBBtn className='mb-4' size='lg' onClick={handleRegistration}>{t("Register")}</MDBBtn>
              {signUpError && (
                <p className="error" style={{ color: signUpError != "User successfully created" ? "red" : "green" }}>
                  {signUpError}
                </p>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default SignUp;