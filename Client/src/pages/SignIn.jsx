import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
// import Footer from "../components/Footer";
import "../css/login.css";
// import {
//   MDBBtn,
//   MDBContainer,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBRow,
//   MDBCol,
//   MDBInput,
//   MDBCheckbox
// }
// from 'mdb-react-ui-kit';
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
} from "mdb-react-ui-kit";

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
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp"
              className="w-100 rounded-top"
              alt="Sample photo"
            />
            {/* <MDBCardImage 
         src="../../src/pictures/FullLogo-removebg-preview.png"
        alt='logo' className='rounded-t-5 rounded-tr-lg-0' fluid /> */}

            <MDBCardBody className="px-5">
              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Sign in</h3>
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
                Sign in
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
    // <MDBContainer className='my-5'>
    //   <MDBCard>

    //     <MDBRow className='g-0 d-flex align-items-center'>

    //       <MDBCol md='4'>
    //        <MDBCardImage
    //   src="../../src/pictures/FullLogo-removebg-preview.png"
    //    alt='logo' className='rounded-t-5 rounded-tr-lg-0' fluid />

    //       </MDBCol>

    //       <MDBCol md='8'>
    //       <h2>Sign in</h2>

    //         <MDBCardBody>
    //           <MDBInput wrapperClass='mb-4' label='user Name' id='form1' type='email' value={userName} onChange={(e) => setUserName(e.target.value)}/>
    //           <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
    //           <div className="d-flex justify-content-between mx-4 mb-4">
    //             <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
    //           </div>

    //           <MDBBtn className="mb-4 w-100" onClick={handleLogin}>Sign in</MDBBtn>
    //              {loginError && (
    //           <p className="error" style={{ color: "red" }}>
    //           {loginError}
    //           </p>
    //            )}
    //         </MDBCardBody>

    //       </MDBCol>

    //     </MDBRow>

    //   </MDBCard>
    // </MDBContainer>
  );

  // <div className="registration">
  //   <h2 className="title">Sign in</h2>
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
  //   {loginError && (
  //     <p className="error" style={{ color: "red" }}>
  //       {loginError}
  //     </p>
  //   )}
  //   <button className="btnOkLogIn" onClick={handleLogin}>
  //     Connect
  //   </button>
  //   <Footer />
  // </div>
  //);
}
export default SignIn;
