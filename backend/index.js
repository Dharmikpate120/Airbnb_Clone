const { fetchUser } = require("./middleware/fetchUser");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
// const socket = require("socket.io");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const app = express();
const server = createServer(app);

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/profileImage", express.static(path.join(__dirname, "profileImages")));
app.use("/roomImages", express.static(path.join(__dirname, "roomImages")));

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "airbnb_clone",
});

function jwtGenerator(data) {
  const jwtKey = "Dh4rm1kP473lv";
  const token = jwt.sign(data, jwtKey);
  return token;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/profileImages");
  },
  filename: (req, file, cb) => {
    const filespliter = file.originalname.split(".");

    cb(
      null,
      filespliter[0] + `_${Date.now()}.${filespliter[filespliter.length - 1]}`
    );
  },
});

const roomStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/roomImages");
  },
  filename: (req, file, cb) => {
    const filespliter = file.originalname.split(".");
    cb(
      null,
      filespliter[0] + `_${Date.now()}.${filespliter[filespliter.length - 1]}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
}).single("profileImage");

const roomImageupload = multer({
  storage: roomStorage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Image format not supported!"));
    }
    cb(null, true);
  },
}).any("roomImages");

// done
app.post("/signin", async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const result = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT \`phonenumber\`, \`username\`, \`password\` FROM \`authentication\` WHERE phonenumber=${phone};`,
      (err, results) => {
        if (err) {
          console.log(err);
          resolve([]);
          return;
        }
        resolve(results);
      }
    );
  });
  if (result.length === 0) {
    res.json({ error: "user not found! please signup again!" });
    return;
  } else if (parseInt(result[0]?.phonenumber) === parseInt(phone)) {
    bcrypt.compare(password, result[0].password, (err, result) => {
      if (result) {
        const token = {
          phone: phone,
        };
        const auth_token = jwtGenerator(token);
        res.json({ auth_token });
      }
    });
  } else {
    res.json({ error: "password don't match. try again!" });
    return;
  }
});
// done
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const phone = req.body.phone;
  const password = req.body.password;

  const data = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT \`phonenumber\`, \`username\`, \`password\` FROM \`authentication\` WHERE phonenumber=${phone};`,
      (err, results) => {
        if (err) {
          console.log(err);
          resolve([]);
          return;
        }
        resolve(results);
      }
    );
  });
  if (data[0]?.phonenumber) {
    res.json({ error: "User Already Exist" });
    return;
  }
  bcrypt.genSalt(10, (err, salt) => {
    try {
      bcrypt.hash(password, salt, async (err, hash) => {
        const result = await new Promise((resolve, reject) => {
          connection.query(
            `INSERT INTO \`authentication\`(\`phonenumber\`, \`username\`, \`password\`) VALUES ('${phone}','${username}','${hash}')`,
            (err, results) => {
              if (err) {
                console.log(err);
                resolve([]);
                return;
              }
              resolve(results);
            }
          );
        });
        if (result) {
          const token = {
            phone: phone,
          };
          const auth_token = jwtGenerator(token);
          res.json({ auth_token });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ error: "unexpected error occured" });
    }
  });
  const userdata = await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO \`userdata\`(\`phonenumber\`, \`name\`) VALUES ('${phone}','${username}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
});
// done
app.post("/addUserdata", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err.message);
      res.json({ error: err.message });
      return;
    } else {
      const phone = fetchUser(req, 1);
      const email = req.body.email;
      const name = req.body.name;
      const emailString = !email ? "" : `,\`emailaddress\`='${email}'`;
      const nameString = !name ? "" : `\`name\`='${name}'`;
      const imageString = !req.file
        ? ""
        : `,\`profileimage\`='${req.file.filename}'`;

      var returnobject = { success: "Data inserted successfully!" };
      if (!req.file) {
        returnobject = {
          ...returnobject,
          error:
            "Image not received! select an image to set it as profile image!",
        };
      }
      connection.query(
        `UPDATE \`userdata\` SET ${nameString}${imageString} ${emailString} WHERE phonenumber=${phone};`,
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.json(returnobject);
  });
});
// done
app.post("/fetchUserdata", fetchUser, async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT \`phonenumber\`, \`emailaddress\`, \`name\`, \`profileImage\` FROM \`userdata\` WHERE phonenumber=${req.body.phone}`,
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      }
    );
  });
  if (data.length > 1) {
    res.json({ error: "an Internal Error Has Occured" });
    console.log({
      threat: "multiple entries with same phone number in userdata table",
    });
  }
  res.json(data[0]);
});
// done
app.post("/addNewRoom", fetchUser, async (req, res) => {
  roomImageupload(req, res, function (err) {
    if (err) {
      res.json({ error: err.message });
      return;
    } else {
      const phone = fetchUser(req, 1);
      const id = `${phone}_${Date.now()}`;
      const rate = req.body.rate;
      const minrentaltime = req.body.minrentaltime;
      const maxrentaltime = req.body.maxrentaltime;
      const lastdate = req.body.lastdate;
      const address = req.body.address;
      const amenities = req.body.amenities;

      var imageNames = "";
      req.files.forEach((element) => {
        imageNames += `${element.filename};`;
      });
      const query = `INSERT INTO \`rooms\`(\`roomid\`,\`phonenumber\`, \`roomImages\`, \`rate\`, \`minrentaltime\`, \`maxrentaltime\`, \`lastdate\`, \`address\`, \`amenities\`) VALUES ('${id}','${phone}','${imageNames}','${rate}','${minrentaltime}','${maxrentaltime}','${lastdate}','${address}','${amenities}')`;

      connection.query(query, (err, results) => {
        if (err) {
          console.log(err);
          res.json({ error: "Please Insert valid data!" });
          return;
        }
        res.json({ success: "Room Published Successfully!" });
      });
    }
  });
});
//done
app.post("/fetchYourRoomAds", fetchUser, async (req, res) => {
  const phone = req.body.phone;

  connection.query(
    `SELECT \`roomid\`, \`phonenumber\`, \`roomImages\`, \`rate\`, \`minrentaltime\`, \`maxrentaltime\`, \`lastdate\`, \`address\`, \`amenities\`, \`isbooked\`, \`cancelation\` FROM \`rooms\` WHERE phonenumber=${phone}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          error: "cannot fetch your RoomAds Currently, Please Try again later!",
        });
        return;
      }
      res.json(result);
    }
  );
});
//done
app.post("/removeRoom", fetchUser, (req, res) => {
  const phone = req.body.phone;
  const roomId = req.body.roomId;

  connection.query(
    `DELETE FROM \`rooms\` WHERE roomId='${roomId}' AND phonenumber='${phone}'`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.json({ error: "you cannot delete this data!" });
        return;
      }
      res.json({ success: "removed the room successfully!" });
    }
  );
});
// done
app.post("/fetchRooms", fetchUser, (req, res) => {
  connection.query(
    `SELECT \`roomid\`, \`phonenumber\`, \`roomImages\`, \`rate\`, \`minrentaltime\`, \`maxrentaltime\`, \`lastdate\`, \`address\`, \`amenities\`, \`isbooked\`, \`cancelation\` FROM \`rooms\` WHERE 1 `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ error: "Please Signin using verified methods!" });
        return;
      }
      result = result.filter((element) => {
        return element.isbooked === "0";
      });

      res.json(result);
    }
  );
});
// done
app.post("/searchRooms", fetchUser, (req, res) => {
  const searchString = req.body.searchString;

  connection.query(
    `SELECT \`roomid\`, \`phonenumber\`, \`roomImages\`, \`rate\`, \`minrentaltime\`, \`maxrentaltime\`, \`lastdate\`, \`address\`, \`amenities\`, \`isbooked\`, \`cancelation\` FROM \`rooms\` WHERE isbooked='0' AND address LIKE '%${searchString}%'`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ error: "Please Signin using verified methods!" });
        return;
      }
      result.filter((element) => {
        return element.isbooked === "0";
      });
      console.log(result);
      res.json(result);
    }
  );
});
//done
app.post("/bookARoom", fetchUser, async (req, res) => {
  const phone = req.body.phone;
  const roomId = req.body.roomId;

  const data = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT  \`phonenumber\`, \`isbooked\` FROM \`rooms\` WHERE roomId='${roomId}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({
            error: "cannot book your room right now please try again leter!",
          });
          return;
        }
        resolve(result);
      }
    );
  });
  console.log(data);
  isbooked = data[0].isbooked;
  ownerPhone = data[0].phonenumber;
  if (!Number(isbooked)) {
    connection.query(
      `SELECT \`bookings\` FROM \`userdata\` WHERE phonenumber=${phone}`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ error: "unknown error" });
          return;
        }
        var bookings = result[0].bookings + `${roomId};`;

        connection.query(
          `UPDATE \`userdata\` SET \`bookings\`='${bookings}' WHERE phonenumber='${phone}'`,
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({
                error: "cannot book your room currently, Please try again!",
              });
              return;
            }
            connection.query(
              `UPDATE \`rooms\` SET \`isbooked\`='${phone}' WHERE roomId='${roomId}'`,
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.json({ error: "error occured while booking your room!" });
                  return;
                }
                res.json({ roomBooked: "Your room booked successfully!" });
              }
            );
          }
        );
      }
    );
  } else {
    res.json({
      roomNotAvailable:
        "room already booked by someone else please choose another room!",
    });
  }
});
//done
app.post("/fetchBookings", fetchUser, async (req, res) => {
  const phone = req.body.phone;

  var bookings = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT \`bookings\` FROM \`userdata\` WHERE phonenumber=${phone}`,
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        resolve(result);
      }
    );
  });
  bookings = bookings[0].bookings.split(";");
  var roomString = "";
  bookings.pop();
  bookings.forEach((element) => {
    roomString += `roomid='${element}' OR `;
  });

  const query = `SELECT \`roomid\`, \`phonenumber\`, \`roomImages\`, \`rate\`, \`minrentaltime\`, \`maxrentaltime\`, \`lastdate\`, \`address\`, \`amenities\`, \`isbooked\`, \`cancelation\` FROM \`rooms\` WHERE ${roomString} 0`;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ error: "please Signin Using varified methods!" });
      return;
    }
    res.json(result);
  });
});
//done
app.post("/cancelBooking", fetchUser, async (req, res) => {
  const phone = req.body.phone;
  const roomId = req.body.roomId;

  connection.query(
    `SELECT \`bookings\` FROM \`userdata\` WHERE phonenumber=${phone}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          error: "cancelation error occured, please try again later",
        });
        return;
      }
      var available = false;
      result = result[0].bookings.split(";");
      result.pop();
      result.forEach((element) => {
        if (element === roomId) {
          available = true;
        }
      });
      if (available) {
        connection.query(
          `UPDATE \`rooms\` SET \`cancelation\`=1 WHERE roomId='${roomId}'`,
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({
                error: "cancelation error occured, please try again later",
              });
              return;
            }
            res.json(result);
          }
        );
      }
    }
  );
});

app.post("/approveCancelation", fetchUser, async (req, res) => {
  const phone = req.body.phone;
  const roomId = req.body.roomId;

  const booker = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT \`isbooked\` FROM \`rooms\` WHERE roomid='${roomId}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ error: "error" });
          return;
        }
        resolve(result[0].isbooked);
      }
    );
  });
  if (booker !== 0) {
    connection.query(
      `UPDATE \`rooms\` SET \`isbooked\`='0',\`cancelation\`=0 WHERE roomid='${roomId}' AND Phonenumber='${phone}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({
            error: "failed to approve cancelation, please try again later!",
          });
        }
        connection.query(
          `SELECT \`bookings\` FROM \`userdata\` WHERE phonenumber='${booker}'`,
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({ error: "error" });
              return;
            }
            result = result[0].bookings.split(";").filter((element) => {
              return element !== roomId;
            });
            result.pop();
            var bookings = "";
            if (result.length !== 0) {
              result.forEach((element) => {
                bookings += `${element};`;
              });
            }
            connection.query(
              `UPDATE \`userdata\` SET \`bookings\`='${bookings}' WHERE phonenumber=${booker}`,
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.json({ error: "some error occured" });
                  return;
                }
                // console.log(result);
                res.json({ requestCanceled: "cancelation Successful!" });
              }
            );
          }
        );
      }
    );
  }
});

server.listen(5000, () => {
  console.log("backend listening at port : 5000");
});
