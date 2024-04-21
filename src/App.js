import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Messenger from "./Context/Messenger";
import Signin from "./components/Signin";
import SearchRoom from "./components/SearchRoom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import AddNewRoom from "./components/AddNewRoom";
import BookRoom from "./components/BookRoom";
import Bookings from "./components/Bookings";
import YourRoomAds from "./components/YourRoomAds";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Messenger>
        <BrowserRouter>
          <Navbar />
          <Routes>
          {/* done */}
            <Route path="/" Component={Home}></Route>
            {/* done */}
            <Route path="/signin" Component={Signin} />
            {/* done */}
            <Route path="/shareRoom" Component={AddNewRoom} />
            {/* done */}
            <Route path="/searchRoom" Component={SearchRoom} />
            {/* done */}
            <Route path="/profile" Component={Profile} />
            {/* done */}
            <Route path="/editprofile" Component={EditProfile} />
            {/* done */}
            <Route path="/bookRoom" Component={BookRoom} />
            {/* done */}
            <Route path="/bookings" Component={Bookings} />
            {/* done */}
            <Route path="/YourRoomAds" Component={YourRoomAds} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Messenger>
    </>
  );
}

export default App;
