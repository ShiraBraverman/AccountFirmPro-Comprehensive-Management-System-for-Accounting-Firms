import React, { useState, useContext, useEffect } from "react";
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
  // MDBSelect
}

from 'mdb-react-ui-kit';
const SignUp = () => {
  const { signUp, user } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [employeType, setEmployeType] = useState("Role 1");
  const [userRole, setUserRole] = useState("Client");

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
      await signUp(userName, password, employeType, userRole);
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

          <MDBCard  style={{maxWidth: '600px'}}>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp' className='w-100 rounded-top'  alt="Sample photo"/>

            <MDBCardBody className='px-5'>

              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Create Account</h3>
            <MDBInput label='User Name' id='form1' type='text' wrapperClass='mb-4' value={userName} onChange={(e) => setUserName(e.target.value)}/>

              <MDBRow>

                <MDBCol md='6'>
                    <MDBInput label='Password' id='form2' wrapperClass='datepicker mb-4' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {/* //             <MDBInput label='Password' id='form3' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/> */}

                  {/* <MDBInput wrapperClass='datepicker mb-4' label='Select a date' id='form2' type='text'/> */}
                </MDBCol>

                <MDBCol md='6' className='mb-4'>
            <MDBInput label='Repeat your password' id='form3' type='password' value={passwordVerify} onChange={(e) => setPasswordVerify(e.target.value)}/>

                  {/* <MDBSelect
                    data={[
                      { text: 'Gender', value: 1, disabled: true },
                      { text: 'Female', value: 2 },
                      { text: 'Male', value: 3 }
                    ]}
                    /> */}
                </MDBCol>

              </MDBRow>

              {/* <MDBSelect
                className='mb-4'
                data={[
                  { text: 'Class', value: 1, disabled: true },
                  { text: 'Class 1', value: 2 },
                  { text: 'Class 2', value: 3 },
                  { text: 'Class 3', value: 3 }
                ]}
                /> */}
<MDBRow>
  <MDBCol md='12'>
    <div className="input-row">
    <select
        className="input1"
        value={userRole}
        onChange={(e) => setUserRole(e.target.value)}
      >
        <option value="Client">Client</option>
        {user.role == "Admin" && (
          <>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </>
        )}
      </select>
      <br />
      {userRole === "Employee" && (
        <select
          className="input1"
          value={employeType}
          onChange={(e) => setEmployeType(e.target.value)}
        >
          <option value="Role 1">Role 1</option>
          <option value="Role 2">Role 2</option>
        </select>




      // <select className="input1" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
      //   <option value="Client">Client</option>
      //   {user.role == "Admin" && (
      //     <>
      //       <option value="Employee">Employee</option>
      //       <option value="Admin">Admin</option>
      //     </>
      //   )}
      // </select>
      
      // {userRole === "Employee" && (
      //   <select className="input1" value={employeType} onChange={(e) => setEmployeType(e.target.value)}>
      //     <option value="Role 1">Role 1</option>
      //     <option value="Role 2">Role 2</option>
      //   </select>
      )}
    </div>
  </MDBCol>
</MDBRow>

           

              {/* <MDBBtn color='success' className='mb-4' size='lg'>Submit</MDBBtn> */}
                        <MDBBtn className='mb-4' size='lg'  onClick={handleRegistration}>Register</MDBBtn>
                        {signUpError && (
        <p className="error" style={{ color: "red" }}>
          {signUpError}
        </p>
      )}
            </MDBCardBody>
            
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
    // <MDBContainer fluid>

    //   <MDBCard className='text-black m-5' style={{borderRadius: '25px'}}>
    //     <MDBCardBody>
    //       <MDBRow>
    //         <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

    //           <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Create Account</p>

    //           <div className="d-flex flex-row align-items-center mb-4 ">
    //             <MDBIcon fas icon="user me-3" size='lg'/>

    //             <MDBInput label='User Name' id='form1' type='text' className='w-100' value={userName} onChange={(e) => setUserName(e.target.value)}/>
    //           </div>

    //           <div className="d-flex flex-row align-items-center mb-4">
    //             <MDBIcon fas icon="envelope me-3" size='lg'/>
    //             <MDBInput label='Your Email' id='form2' type='email'/>
    //           </div>

    //           <div className="d-flex flex-row align-items-center mb-4">
    //             <MDBIcon fas icon="lock me-3" size='lg'/>
    //             <MDBInput label='Password' id='form3' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
    //           </div>
    
    //           <div className="d-flex flex-row align-items-center mb-4">
    //             <MDBIcon fas icon="key me-3" size='lg'/>
    //             <MDBInput label='Repeat your password' id='form4' type='password' value={passwordVerify} onChange={(e) => setPasswordVerify(e.target.value)}/>
    //           </div>

    //           <div className='mb-4'>
    //              <select
    //     className="input"
    //     value={userRole}
    //     onChange={(e) => setUserRole(e.target.value)}
    //   >
    //     <option value="Client">Client</option>
    //     {user.role == "Admin" && (
    //       <>
    //         <option value="Employee">Employee</option>
    //         <option value="Admin">Admin</option>
    //       </>
    //     )}
    //   </select>
    //   <br />
    //   {userRole === "Employee" && (
    //     <select
    //       className="input"
    //       value={employeType}
    //       onChange={(e) => setEmployeType(e.target.value)}
    //     >
    //       <option value="Role 1">Role 1</option>
    //       <option value="Role 2">Role 2</option>
    //     </select>
    //   )}              </div>

    //           <MDBBtn className='mb-4' size='lg'  onClick={handleRegistration}>Register</MDBBtn>
    //           {signUpError && (
    //     <p className="error" style={{ color: "red" }}>
    //       {signUpError}
    //     </p>
    //   )}
    //         </MDBCol>

    //         <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
    //           <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
    //         </MDBCol>

    //       </MDBRow>
    //     </MDBCardBody>
    //   </MDBCard>

    // </MDBContainer>





    // <div className="registration">
    //   <h2 className="title">Create Account</h2>
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userName}
    //     placeholder="user name"
    //     onChange={(e) => setUserName(e.target.value)}
    //   />
    //   <br />
    //   <input
    //     type="password"
    //     className="input"
    //     value={password}
    //     placeholder="password"
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <br />
    //   <input
    //     type="password"
    //     className="input"
    //     value={passwordVerify}
    //     placeholder="password-verify"
    //     onChange={(e) => setPasswordVerify(e.target.value)}
    //   />
    //   <br />
    //   <select
    //     className="input"
    //     value={userRole}
    //     onChange={(e) => setUserRole(e.target.value)}
    //   >
    //     <option value="Client">Client</option>
    //     {user.role == "Admin" && (
    //       <>
    //         <option value="Employee">Employee</option>
    //         <option value="Admin">Admin</option>
    //       </>
    //     )}
    //   </select>
    //   <br />
    //   {userRole === "Employee" && (
    //     <select
    //       className="input"
    //       value={employeType}
    //       onChange={(e) => setEmployeType(e.target.value)}
    //     >
    //       <option value="Role 1">Role 1</option>
    //       <option value="Role 2">Role 2</option>
    //     </select>
    //   )}
    //   {signUpError && (
    //     <p className="error" style={{ color: "red" }}>
    //       {signUpError}
    //     </p>
    //   )}
    //   <button className="btnOkSignUp" onClick={handleRegistration}>
    //     Save
    //   </button>
    //   <br />
    // </div>
  );
};

export default SignUp;
