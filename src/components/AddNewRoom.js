import React, { useContext, useEffect, useState } from "react";
import apiContext from "../Context/apiContext";

const AddNewRoom = () => {
  const { auth_token, signinRef, addNewRoom,homeRef } = useContext(apiContext);

  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  const [roomData, setRoomData] = useState({
    rate: "",
    minrentaltime: "",
    maxrentaltime: "",
    lastdate: "",
    address: "",
    amenities: "",
  });
  const [roomImages, setRoomImages] = useState();

  const RoomDataChange = (e) => {
    setRoomData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("rate", roomData.rate);
    formdata.append("minrentaltime", roomData.minrentaltime);
    formdata.append("maxrentaltime", roomData.maxrentaltime);
    formdata.append("lastdate", roomData.lastdate);
    formdata.append("address", roomData.address);
    formdata.append("amenities", roomData.amenities);
    for (var i = 0; i < roomImages.length; i++) {
      formdata.append("roomImages[]", roomImages[i]);
    }
    const res = await addNewRoom(formdata);

    homeRef.current.click();
  };
  return (
    <div className="addRoomCover">
      <div className="addRoomMain">
        <div className="title">Share A New Room</div>
        <form className="addRoomForm">
          <div className="shareRoomImages">
            <div className="title">Select Room Images:</div>
            <input
              type="file"
              multiple
              name="roomImages"
              onChange={(e) => {
                console.log(e.target.files);
                setRoomImages(e.target.files);
              }}
            />
          </div>
          <div className="rate">
            <div className="title">Enter Rate of Room:</div>

            <input type="text" name="rate" onChange={RoomDataChange} />
          </div>
          <div className="minrentaltime">
            <div className="title">Enter Minimum Rental Time:</div>

            <input type="text" name="minrentaltime" onChange={RoomDataChange} />
          </div>
          <div className="maxrentaltime">
            <div className="title">Enter Maximum Rental Time:</div>
            <input type="text" name="maxrentaltime" onChange={RoomDataChange} />
          </div>
          <div className="lastdate">
            <div className="title">enter Lastdate::</div>
            <input type="text" name="lastdate" onChange={RoomDataChange} />
          </div>
          <div className="address">
            <div className="title">Enter Room Address:</div>
            <input type="text" name="address" onChange={RoomDataChange} />
          </div>
          <div className="amenities">
            <div className="title">Enter Room Amenities:</div>
            <input type="text" name="amenities" onChange={RoomDataChange} />
          </div>
          <button className="addNewRoomSubmit"onClick={onSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddNewRoom;
