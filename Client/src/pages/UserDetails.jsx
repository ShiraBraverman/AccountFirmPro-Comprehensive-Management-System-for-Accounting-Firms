import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
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
} from 'mdb-react-ui-kit';

const UserDetails = () => {
  const { user, setUser } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [signUpError, setSignUpError] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: currentUser?.name || "",
    userName: currentUser?.userName || "",
    email: currentUser?.email || "",
    street: currentUser?.street || "",
    city: currentUser?.city || "",
    zipcode: currentUser?.zipcode || "",
    phone: currentUser?.phone || "",
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch("http://localhost:3000/myClient/getClientID", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.clientID) {
          const clientResponse = await fetch(
            `http://localhost:3000/users/user?id=${data.clientID}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const client = await clientResponse.json();
          setCurrentUser(client);
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        setCurrentUser(user);
      }
    };

    fetchClientData();
  }, [user, location]);

  useEffect(() => {
    if (currentUser) {
      setUserDetails({
        name: currentUser.name || "",
        userName: currentUser.userName || "",
        email: currentUser.email || "",
        street: currentUser.street || "",
        city: currentUser.city || "",
        zipcode: currentUser.zipcode || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const postUser = () => {
    if (
      userDetails.name === "" ||
      userDetails.userName === "" ||
      userDetails.street === "" ||
      userDetails.city === "" ||
      userDetails.email === "" ||
      userDetails.zipcode === "" ||
      userDetails.phone === ""
    ) {
      setSignUpError("Please fill all field.");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userDetails),
    };

    fetch(
      `http://localhost:3000/users/user?id=${currentUser.id}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          setSignUpError(response.message);
          return;
        }
        return response.json();
      })
      .then((updatedUser) => {
        if (updatedUser) {
          setUserDetails(updatedUser);
          setSignUpError("The user has been updated successfully");
          setUser(updatedUser);
          // setTimeout(() => {
          //   navigate("/updates");
          // }, 3000);
        }
      })
      .catch((error) => {
        setSignUpError(error.message);
      });
  };

  return (

    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center'>

        <MDBCol lg='8'>

          <MDBCard style={{ maxWidth: '600px' }}>
            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp' className='w-100 rounded-top' alt="Sample photo" />

            <MDBCardBody className='px-5'>

              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">User Details</h3>

              <MDBRow>
                <MDBCol md='6'>
                  <MDBInput label='Name' id='form1' type='text' wrapperClass='datepicker mb-4' value={userDetails.name || ""} onChange={handleChange} name="name" />
                </MDBCol>

                <MDBCol md='6'>
                  <MDBInput label='UserName' id='form2' type='text' wrapperClass='datepicker mb-4' value={userDetails.userName || ""} onChange={handleChange} name="userName" />
                </MDBCol>

                <MDBCol md='6'>
                  <MDBInput label='email' id='form3' wrapperClass='datepicker mb-4' name="email" type='text' value={userDetails.email || ""} onChange={handleChange} />
                </MDBCol>

                <MDBCol md='6' className='mb-4'>
                  <MDBInput label='city' id='form4' type='text' name='city' value={userDetails.city || ""} onChange={handleChange} />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md='6'>
                  <MDBInput label='street' id='form5' type='text' name='street' value={userDetails.street || ""} onChange={handleChange} />
                </MDBCol>

                <MDBCol md='6' className='mb-4'>
                  <MDBInput label='zipcode' id='form6' type='zipcode' name='zipcode' value={userDetails.zipcode || ""} onChange={handleChange} />
                </MDBCol>

              </MDBRow>
              <MDBBtn className='mb-4' size='lg' onClick={postUser}>Save</MDBBtn>
              {signUpError && (
                <p
                  className="error"
                  style={{
                    color:
                      signUpError == "The user has been updated successfully"
                        ? "green"
                        : "red",
                  }}
                >
                  {signUpError}
                </p>
              )}
            </MDBCardBody>

          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>



    // <div className="registration">
    //   <h2 className="title">User Details</h2>
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.name || ""}
    //     name="name"
    //     placeholder="name"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.userName || ""}
    //     name="userName"
    //     placeholder="userName"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.email || ""}
    //     name="email"
    //     placeholder="email"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.street || ""}
    //     name="street"
    //     placeholder="street"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.city || ""}
    //     name="city"
    //     placeholder="city"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.zipcode || ""}
    //     name="zipcode"
    //     placeholder="zipcode"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   <input
    //     type="text"
    //     className="input"
    //     value={userDetails.phone || ""}
    //     name="phone"
    //     placeholder="phone"
    //     onChange={handleChange}
    //   />
    //   <br />
    //   {signUpError && (
    //     <p
    //       className="error"
    //       style={{
    //         color:
    //           signUpError == "The user has been updated successfully"
    //             ? "green"
    //             : "red",
    //       }}
    //     >
    //       {signUpError}
    //     </p>
    //   )}
    //   <button className="Connect" onClick={postUser}>
    //     Save
    //   </button>
    //   <br />
    // </div>
  );
};

export default UserDetails;
