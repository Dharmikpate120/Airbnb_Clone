import React, { useContext, useEffect, useState } from "react";
import apiContext from "../Context/apiContext";
import RoomElement from "./RoomElement";

const Bookings = () => {
  const { auth_token, signinRef, fetchBookings, cancelBooking } =
    useContext(apiContext);
  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  const [bookings, setBookings] = useState([]);
  const [refresher, setRefresher] = useState(false);
  async function bookingFetcher() {
    setBookings(await fetchBookings());
  }
  useEffect(() => {
    bookingFetcher();
  }, [refresher]);

  return (
    <div className="bookingsCover">
      <div className="bookingsMain">
        {bookings[0] ?bookings?.map((element, index) => {
          return (
            <div className="bookedRoom" key={index}>
              <RoomElement data={element} view={true} />
              {element.cancelation === 0 ? (
                <div className="cancelRoom">
                  <button
                    onClick={() => {
                      cancelBooking(element.roomid);
                      setRefresher((data) => !data);
                    }}
                  >
                    Request Cancelation
                  </button>
                </div>
              ) : (
                <div className="cancelRoom">Applied For Cancelation! </div>
              )}
            </div>
          );
        }):<div className="noRoomsFound"> You haven't booked any rooms yet!</div>}
      </div>
    </div>
  );
};

export default Bookings;
