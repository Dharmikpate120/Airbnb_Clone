import React, { useRef, useState } from "react";
import apiContext from "./apiContext";

const Messenger = (props) => {
  const auth_token = useRef("");
  const homeRef = useRef(null);
  const signinRef = useRef(null);
  const phoneRef = useRef("");
  const [searchString, setSearchString] = useState("");
  const [bookingRoomId, setBookingRoomId] = useState("");
  const [searchRoom, setSearchRoom] = useState([]);

  const userSignin = async (data) => {
    try {
      var response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response = await response.json();
      if (!response.error) {
        auth_token.current = response.auth_token;
        document.cookie = `auth_token=${response.auth_token};max-age=${
          60 * 60 * 24 * 10
        }`;
        homeRef.current.click();
      } else {
        console.log(response.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const userSignup = async (data) => {
    try {
      var response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      response = await response.json();
      console.log(response);
      if (!response.error) {
        auth_token.current = response.auth_token;
        document.cookie = `auth_token=${response.auth_token};max-age=${
          60 * 60 * 24 * 10
        }`;
        homeRef.current.click();
      } else {
        console.log(response?.error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAuthToken = () => {
    document.cookie.split(";").forEach((element) => {
      element = element.split("=");
      if (element[0].trim() === "auth_token") {
        auth_token.current = element[1];
      }
    });
  };

  const addUserData = async (data) => {
    try {
      var response = await fetch("http://localhost:5000/addUserdata", {
        method: "POST",
        headers: {
          auth_token: auth_token.current,
        },
        body: data,
      });
      console.log(response);
      response = await response.json();
      if (!response.error) {
        return { success: "userUpdated Successfully!" };
      } else {
        console.log(response?.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    console.log(auth_token);
    var userdata = await fetch("http://localhost:5000/fetchUserdata", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
    });
    userdata = await userdata.json();
    console.log(userdata);
    return userdata;
  };

  const addNewRoom = async (data) => {
    const result = await fetch("http://localhost:5000/addNewRoom", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
      body: data,
    });
    return result;
  };

  const fetchRooms = async () => {
    var data = await fetch("http://localhost:5000/fetchRooms", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
    });
    data = await data.json();
    return data;
  };

  const searchRooms = async (searchString) => {
    var data = await fetch("http://localhost:5000/searchRooms", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ searchString }),
    });
    data = await data.json();
    return data;
  };

  const bookaRoom = async (roomId) => {
    var data = await fetch("http://localhost:5000/bookARoom", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });
    data = await data.json();
    console.log(data);
    if (data?.error) {
      console.log(data.error);
      return;
    }
    return data;
  };

  const fetchBookings = async () => {
    var data = await fetch("http://localhost:5000/fetchBookings", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
    });
    data = data.json();
    return data;
  };

  const cancelBooking = async (roomId) => {
    var data = await fetch("http://localhost:5000/cancelBooking", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });
  };

  async function fetchRoomAds() {
    var data = await fetch("http://localhost:5000/fetchYourRoomAds", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
      },
    });
    data = data.json();
    return data;
  }

  const removeRoom = async (roomId) => {
    var data = await fetch("http://localhost:5000/removeRoom", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });
    console.log(await data.json());
  };
  const approveCancelation = async (roomId) => {
    var data = await fetch("http://localhost:5000/approveCancelation", {
      method: "POST",
      headers: {
        auth_token: auth_token.current,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });
    console.log(await data.json());
  };

  return (
    <apiContext.Provider
      value={{
        auth_token,
        homeRef,
        signinRef,
        phoneRef,
        searchRoom,
        setSearchRoom,
        searchString,
        setSearchString,
        bookingRoomId,
        setBookingRoomId,
        userSignup,
        userSignin,
        fetchAuthToken,
        addUserData,
        fetchUserData,
        addNewRoom,
        fetchRooms,
        searchRooms,
        bookaRoom,
        fetchBookings,
        cancelBooking,
        fetchRoomAds,
        removeRoom,
        approveCancelation,
      }}
    >
      {props.children}
    </apiContext.Provider>
  );
};

export default Messenger;
