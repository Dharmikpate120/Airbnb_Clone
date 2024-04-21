import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import apiContext from "../Context/apiContext";

const Home = () => {
  const popularLocations = [
    {
      name: "Myrte Beach",
      state: "S.C.",
      image:
        "https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/myrtlebeach/Boarwalk_skywheel_sunset_061dd2e8-81cf-4de7-ab63-67b2263c282c.jpg",
    },
    {
      name: "Hilton Head",
      state: "S.C.",
      image:
        "https://qcexclusive.com/wp-content/uploads/2017/02/hiltonhead2-1170x846.jpg",
    },
    {
      name: "Charleston",
      state: "S.C.",
      image:
        "https://static1.squarespace.com/static/54e4e6bfe4b04465619a3b2f/54f659a2e4b088f91a788ba0/552050afe4b04e745c95eb08/1428786039927/Charleston+Night.jpg",
    },
    {
      name: "Austin",
      state: "T.X.",
      image:
        "https://th.bing.com/th/id/OIP.CLgQTzwpciET02u2p5hTAAHaEk?rs=1&pid=ImgDetMain",
    },
    {
      name: "Poconos",
      state: "P.A.",
      image:
        "https://a.cdn-hotels.com/gdcs/production199/d784/eb7e1a4f-2fb9-4731-bac5-a90b5deb8cee.jpg?impolicy=fcrop&w=800&h=533&q=medium",
    },
    {
      name: "Naples",
      state: "F.L.",
      image:
        "https://th.bing.com/th/id/OIP.PwHBLfB3ZM91jOlk75jTRAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      name: "Myrte Beach",
      state: "S.C.",
      image:
        "https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/myrtlebeach/Boarwalk_skywheel_sunset_061dd2e8-81cf-4de7-ab63-67b2263c282c.jpg",
    },
    {
      name: "Hilton Head",
      state: "S.C.",
      image:
        "https://qcexclusive.com/wp-content/uploads/2017/02/hiltonhead2-1170x846.jpg",
    },
    {
      name: "Charleston",
      state: "S.C.",
      image:
        "https://static1.squarespace.com/static/54e4e6bfe4b04465619a3b2f/54f659a2e4b088f91a788ba0/552050afe4b04e745c95eb08/1428786039927/Charleston+Night.jpg",
    },
    {
      name: "Austin",
      state: "T.X.",
      image:
        "https://th.bing.com/th/id/OIP.CLgQTzwpciET02u2p5hTAAHaEk?rs=1&pid=ImgDetMain",
    },
    {
      name: "Poconos",
      state: "P.A.",
      image:
        "https://a.cdn-hotels.com/gdcs/production199/d784/eb7e1a4f-2fb9-4731-bac5-a90b5deb8cee.jpg?impolicy=fcrop&w=800&h=533&q=medium",
    },
    {
      name: "Naples",
      state: "F.L.",
      image:
        "https://th.bing.com/th/id/OIP.PwHBLfB3ZM91jOlk75jTRAHaE8?rs=1&pid=ImgDetMain",
    },
  ];
  const {
    fetchAuthToken,
    auth_token,
    signinRef,
    searchString,
    setSearchString,
    setSearchRoom,
    searchRooms,
  } = useContext(apiContext);

  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);
  useEffect(() => {
    fetchAuthToken();
  }, []);
  return (
    <>
      <div className="mainHeader">
        <Link to="/shareRoom" className="shareRoom">
          <img src="https://images2.alphacoders.com/463/463836.jpg"></img>
          <span>Share Your Room</span>
        </Link>
        <Link to="/searchRoom" className="rentRoom">
          <img src="https://t3.ftcdn.net/jpg/00/44/47/72/240_F_44477210_ULogchAmIP4zc5WQeSKnuwSChRZihIC2.jpg"></img>
          <span>Rent A Room</span>
        </Link>
        <ul>
          <li className="item1">
            <Link to="/welcomePage">Welcome</Link>
          </li>
          <li className="item2">
            <Link to="/safetyPrecautions">Safety</Link>
          </li>
          <li className="item3">
            <Link to="/Adventures">Adventure</Link>
          </li>
          <li className="item4">
            <Link to="/Community">Community</Link>
          </li>
        </ul>
      </div>
      <div className="mainFilters">
        <div className="whenFilter">
          <div className="header">When</div>
          <div className="dateSelector">
            <div className="checkinDate">
              Check In
              <input type="date" name="checkindate" />
            </div>
            <div className="checkoutDate">
              Check Out
              <input type="date" name="checkoutdate" />
            </div>
          </div>
        </div>
        <div className="whereFilter">
          <div className="header">Where</div>
          <div className="searchDestination">
            <p>Search Destination</p>
            <span>
              <input
                type="text"
                name="destinationSearch"
                className="searchText"
                value={searchString}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
              <Link
                to="/searchRoom"
                onClick={async () => {
                  setSearchRoom(await searchRooms(searchString));
                }}
                className="searchButton"
              >
                Search
              </Link>
            </span>
          </div>
        </div>
        <div className="profileNavigator">
          <div className="header">Who</div>
          <Link to="/profile" className="createProfile">
            create a profile
          </Link>
        </div>
      </div>
      <div className="popularLocations">
        <div className="headerMain">Popular Locations:</div>
        <div className="locationsContainer">
          {popularLocations.map((element, index) => {
            return (
              <div className="locationMain" key={index}>
                <div className="name">{element.name}</div>
                <div className="state">{element.state}</div>
                <img src={element.image} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
