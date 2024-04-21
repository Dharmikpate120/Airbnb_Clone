import React, { useContext, useEffect, useRef, useState } from "react";
import apiContext from "../Context/apiContext";

const EditProfile = () => {
  const { auth_token, signinRef, addUserData, phoneRef } =
    useContext(apiContext);
  useEffect(() => {
    if (auth_token.current === "") {
      signinRef.current.click();
    }
  }, [auth_token]);

  const profileImageRef = useRef(null);

  const [userdata, setUserdata] = useState({ email: "", name: "" });
  const [pImage, setPImage] = useState(null);
  const [piURL, setpiURL] = useState(null);
  const dataChange = (e) => {
    console.log(userdata);
    setUserdata((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const imageChange = (e) => {
    setPImage(e.target.files[0]);
    setpiURL(URL.createObjectURL(e.target.files[0]));
    console.log(piURL);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", userdata.name);
    formdata.append("email", userdata.email);
    formdata.append("profileImage", pImage);

    const res = await addUserData(formdata);
    console.log(formdata);
  };

  return (
    <div className="editProfileCover">
      <div className="editProfileMain">
        <form onSubmit={submitForm}>
          <div className="phoneNumber">
            <div className="title">Your Phone Number :</div>
            <div className="phoneViewer">{phoneRef.current}</div>
          </div>
          <div className="emailInput">
            <div className="title">Enter EmailAddress:</div>
            <input type="text" name="email" onChange={dataChange} />
          </div>
          <div className="nameInput">
            <div className="title">Enter Your Name:</div>
            <input type="text" name="name" onChange={dataChange} />
          </div>
          <div className="filesInput">
            <div className="title">select Profile Image:</div>
            <input
              className="profileInput"
              type="file"
              name="profileImage"
              onChange={imageChange}
              ref={profileImageRef}
            />
            <div
              className="imageInserter"
              onClick={() => {
                profileImageRef.current.click();
              }}
            >
              <i className="fa-solid fa-plus"></i>
              {piURL && <img className="profileImageViewer" src={piURL} />}
            </div>
          </div>
          <div className="submit">
            <input type="submit" value="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
