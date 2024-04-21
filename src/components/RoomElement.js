import React, { useContext } from "react";
import { Link } from "react-router-dom";
import apiContext from "../Context/apiContext";

const RoomElement = (props) => {
  const { setBookingRoomId } = useContext(apiContext);
  var {
    address,
    amenities,
    lastdate,
    maxrentaltime,
    minrentaltime,
    phonenumber,
    rate,
    roomImages,
    roomid,
  } = props.data;
  console.log(props.data);

  roomImages = roomImages?.split(";");
  roomImages.pop();
  return (
    <div className="roomElementMain">
      <div className="roomImages">
        {roomImages.map((element, index) => {
          return (
            <div className="roomImage">
              <img
                src={`http://localhost:5000/roomImages/${element}`}
                alt="roomImage"
                key={index}
              />
            </div>
          );
        })}
      </div>
      <div className="roomData">
        <div className="address">
          <div className="title">Address</div>
          {address}
        </div>
        <div className="amenities">
          <div className="title">Amenities</div>
          {amenities}
        </div>
        <div className="lastdate">
          <div className="title">LastDate</div>
          {lastdate}
        </div>
        <div className="maxrentaltime">
          <div className="title">Max. Rental Time</div>
          {maxrentaltime} Nights
        </div>
        <div className="minrentaltime">
          <div className="title">Min. Rental Time</div>
          {minrentaltime} Nights
        </div>
        <div className="phonenumber">
          <div className="title">Owner's Phone Number</div>
          {phonenumber}
        </div>
        <div className="rate">
          <div className="title">Rate/Night</div>
          {rate}
        </div>
        {!props.view && (
          <Link
            to="/bookRoom"
            onClick={() => {
              setBookingRoomId(roomid);
            }}
            className="bookRoom"
          >
            book this Room
          </Link>
        )}
      </div>
    </div>
  );
};

export default RoomElement;
