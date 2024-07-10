import React, { useState, useContext } from 'react';
import '../App.css';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow, MDBTypography} from "mdb-react-ui-kit";
import { useTranslation } from "react-i18next";

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const [logoutError, setLogoutError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const confirmLogout = () => {
        try {
            logout();
        }
        catch (err) {
            setLogoutError(err);
        }
    }
    return (
      <section className="vh-100" >
      <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
        <MDBRow className="justify-content-center">
          <MDBCol md="10" lg="8" xl="6">
            <MDBCard>
              <MDBCardBody className="p-4">
                <div className="d-flex flex-start w-100">
                  <div className="w-100">
                    <MDBTypography tag="h5">{t("Are you sure you want to log out?")}</MDBTypography>
                    <div className="d-flex justify-content-between mt-3">
                      <MDBBtn color="success"className='btnCancel' onClick={() => navigate('../updates')} >{t("Cancel")}</MDBBtn>
                      <MDBBtn color="danger" className='btnConfirm' onClick={() => confirmLogout()}>
                      {t("Yes")} <MDBIcon fas icon="long-arrow-alt-right ms-1"  />
                      </MDBBtn>
                      {logoutError && (
                    <p className="error" style={{ color: "red" }}>
                        {logoutError}
                    </p>)}
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