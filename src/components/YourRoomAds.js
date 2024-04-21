import React, { useContext, useEffect, useState } from "react";
import apiContext from "../Context/apiContext";
import RoomElement from "./RoomElement";

const YourRoomAds = () => {
  const {
    auth_token,
    signinRef,
    fetchRoomAds,
    removeRoom,
    approveCancelation,
  } = useContext(apiContext);
  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  const [bookings, setBookings] = useState([]);
  const [refresher, setRefresher] = useState(false);
  async function bookingFetcher() {
    setBookings(await fetchRoomAds());
  }
  useEffect(() => {
    bookingFetcher();
  }, [refresher]);

  return (
    <div className="roomAdsCover">
      <div className="roomAdsMain">
        {bookings[0] ? (
          bookings?.map((element, index) => {
            return (
              <div className="roomAd" key={index}>
                <RoomElement data={element} view={true} />
                {element.cancelation === 0 ? (
                  <div className="removeRoom">
                    <button
                      onClick={() => {
                        removeRoom(element.roomid);
                        setRefresher((data) => !data);
                      }}
                    >
                      Remove Room Ad
                    </button>
                  </div>
                ) : (
                  <div className="removeRoom">
                    <button
                      onClick={() => {
                        approveCancelation(element.roomid);
                        setRefresher((data) => !data);
                      }}
                    >
                      Approve Cancelation
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="noRoomsFound">You Haven't Posted<br/> Any Rooms Yet</div>
        )}
      </div>
    </div>
  );
};

export default YourRoomAds;
