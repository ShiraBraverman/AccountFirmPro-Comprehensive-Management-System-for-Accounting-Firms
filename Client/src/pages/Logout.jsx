import React, { useState, useContext } from 'react';
import '../App.css';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBTextArea,
    MDBTypography,
  } from "mdb-react-ui-kit";
  
  
const Logout = () => {
    const { logout } = useContext(AuthContext);
    const [logoutError, setLogoutError] = useState("");
    const navigate = useNavigate();

    const confirmLogout = () => {
        try {
            logout();
        }
        catch (err) {
            setLogoutError(err);
        }
    }
    return (
        // <div className='logout'>
        //     <div>
        //         <p>Are you sure you want to log out?</p>
        //         <button className='btnConfirm' onClick={() => confirmLogout()}>Yes</button>
        //         <button className='btnCancel' onClick={() => navigate('../updates')}>Cancel</button>
        //         {logoutError && (
        //             <p className="error" style={{ color: "red" }}>
        //                 {logoutError}
        //             </p>
        //         )}
        //     </div>
        // </div>
        <section className="vh-100" >
      <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
        <MDBRow className="justify-content-center">
          <MDBCol md="10" lg="8" xl="6">
            <MDBCard>
              <MDBCardBody className="p-4">
                <div className="d-flex flex-start w-100">
                  {/* <MDBCardImage
                    className="rounded-circle shadow-1-strong me-3"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                    alt="avatar"
                    width="65"
                    height="65"
                  /> */}

                  <div className="w-100">
                    <MDBTypography tag="h5">Are you sure you want to log out?</MDBTypography>
                    {/* <div>
                      <a href="">
                        <MDBIcon far icon="star text-danger me-1" />
                        <MDBIcon far icon="star text-danger me-1" />
                        <MDBIcon far icon="star text-danger me-1" />
                        <MDBIcon far icon="star text-danger me-1" />
                        <MDBIcon far icon="star text-danger me-1" />
                      </a>
                    </div> */}
                    {/* <MDBTextArea label="Do you want to share?" rows={4} /> */}

                    <div className="d-flex justify-content-between mt-3">
                      <MDBBtn color="success"className='btnCancel' onClick={() => navigate('../updates')} >Cancel</MDBBtn>
                      <MDBBtn color="danger"                         className='btnConfirm' onClick={() => confirmLogout()}
                      >
                        Yes <MDBIcon fas icon="long-arrow-alt-right ms-1"  />
                      </MDBBtn>
                      {logoutError && (
                    <p className="error" style={{ color: "red" }}>
                        {logoutError}
                    </p>
                )}
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
    );
};

export default Logout;
