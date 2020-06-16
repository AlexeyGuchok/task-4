const express = require("express");
const config = require("./client/src/config/default");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();
const path = require("path");
const isAuth = require("./middleware/auth.middleware");

let globalconn;
const isAuthWithConn = (req, res, next) => {
  return isAuth(req, res, next, globalconn);
};

app.use(cors());
app.use(express.json({ extended: true }));

const PORT = config.port || 5000;

const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");

app.use("/api/auth", authRoutes);
app.use("/api/link", isAuthWithConn, linkRoutes);

if (process.env.NODE_ENV == "production") {
  app.use("/", express.static(path.join(__dirname, "client", "biuld")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

async function start() {
  try {
    const conn = await mysql.createConnection({
      database: "users",
      host: "localhost",
      user: "root",
      password: "",
    });

    globalconn = conn;

    authRoutes.conn = conn;
    linkRoutes.conn = conn;

    app.listen(PORT, () => console.log(`Стартануло на ${PORT}`));
  } catch (e) {
    console.log("Error, ", e.message);
  }
}
app.get("/", function (req, res) {
  // globalconn.execute("SELECT * FROM users", function (error, result) {
  conn.execute("SELECT * FROM users", function (error, result) {
    if (error) throw error;
    console.log(result);
  });
});

start();
