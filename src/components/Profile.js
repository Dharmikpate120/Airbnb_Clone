import React, { useContext, useEffect, useState } from "react";
import apiContext from "../Context/apiContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { auth_token, signinRef, phoneRef, fetchUserData } =
    useContext(apiContext);
  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  const [userdata, setUserdata] = useState();

  async function fetchdata() {
    var data = await fetchUserData();
    setUserdata(data);
    phoneRef.current = data.phonenumber;
  }
  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <div className="profileCover">
      <div className="profileMain">
      <div className="profileHeader">
        Your Profile
      </div>
        <div className="userImage">
          <img
            src={`http://localhost:5000/profileImage/${userdata?.profileImage}`}
            alt=""
          />
        </div>
        <div className="userdata">
          <div className="title">Your Name :</div>
          <div className="name">{userdata?.name}</div>
          <div className="title">Your phone Number :</div>
          <div className="phone">{userdata?.phonenumber}</div>
          <div className="title">Your Email Address :</div>
          <div className="email">{userdata?.emailaddress}</div>
        </div>
        <Link to="/editProfile">Edit Your Profile</Link>
      </div>
    </div>
  );
};

export default Profile;
