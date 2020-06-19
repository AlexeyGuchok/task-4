const express = require("express");
const config = require("./client/src/config/default");
// const mysql = require("mysql2/promise");

const db = require("./database/database");
const cors = require("cors");
const app = express();
const path = require("path");
const isAuth = require("./middleware/auth.middleware");
const User = require("./models/User");

// let globalconn;
// const isAuthWithConn = (req, res, next) => {
//   return isAuth(req, res, next, globalconn);
// };

let globalconn;
const isAuthWithConn = (req, res, next) => {
  return isAuth(req, res, next, db);
};

app.use(cors());
app.use(express.json({ extended: true }));

const PORT = config.port || 5000;

const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");

app.use("/api/auth", authRoutes);
app.use("/api/link", isAuthWithConn, linkRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

async function start() {
  try {
    // const conn = await mysql.createConnection({
    //   database: "users",
    //   host: "localhost",
    //   user: "root",
    //   password: "",
    // });

    // globalconn = conn;

    // authRoutes.conn = conn;
    // linkRoutes.conn = conn;

    db.authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });

    app.listen(PORT, () => console.log(`PORT: ${PORT}`));
  } catch (e) {
    console.log("Error, ", e.message);
  }
}

start();
