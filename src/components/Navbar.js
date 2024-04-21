import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import apiContext from "../Context/apiContext";

const Navbar = () => {
  const { homeRef, signinRef, fetchAuthToken } = useContext(apiContext);
  useEffect(() => {
    fetchAuthToken();
  }, []);
  return (
    <div className="navbarMain">
      <Link className="siteTitle" to="/" ref={homeRef}>
        She Share Vacation Rentals
      </Link>
      <div className="buttons">
        <Link className="YourRoomAds" to="/YourRoomAds">
          Your Room Ads
        </Link>
        <Link className="bookings" to="/bookings">
          bookings
        </Link>

        <Link className="Login" to="/Signin" ref={signinRef}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
