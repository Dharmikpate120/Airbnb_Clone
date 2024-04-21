import React, { useContext, useEffect, useState } from "react";
import apiContext from "../Context/apiContext";
import RoomElement from "./RoomElement";

const SearchRoom = () => {
  const {
    auth_token,
    signinRef,
    searchString,
    setSearchString,
    fetchRooms,
    searchRooms,
    searchRoom,
    setSearchRoom,
  } = useContext(apiContext);

  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);
  async function datafetcher() {
    if (searchString === "") {
      setSearchRoom(await fetchRooms());
    }
  }
  useEffect(() => {
    datafetcher();
  }, []);
  return (
    <div className="searchPageMain">
      <div className="searchInputs">
        <input
          className="serachText"
          value={searchString}
          placeholder="Search By Address"
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        />
        <button
          className="searchButton"
          onClick={async () => {
            setSearchRoom(await searchRooms(searchString));
          }}
        >
          Search
        </button>
      </div>

      <div className="roomsContainer">
        {searchRoom[0] ? (
          searchRoom?.map((element, index) => {
            return <RoomElement data={element} key={index} />;
          })
        ) : (
          <div className="noRoomsFound">
            No Rooms Available For
            <br />
            Your Entered Location!
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRoom;
