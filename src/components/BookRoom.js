import React, { useContext, useEffect } from "react";
import apiContext from "../Context/apiContext";

const BookRoom = () => {
  const { auth_token, signinRef, bookingRoomId, bookaRoom } =
    useContext(apiContext);

  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  return (
    <div className="bookRoomMain">
      Payment Page & Confirmation
      <button
        onClick={async () => {
          console.log(bookingRoomId);
          if (bookingRoomId !== "") {
            const data = await bookaRoom(bookingRoomId);
            if (data) {
              console.log("room booked successfully!");
            }
          } else {
            console.log("go back and come again ");
          }
        }}
      >
        Make Payment & Confirm Booking
      </button>
    </div>
  );
};

export default BookRoom;
