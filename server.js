const express = require("express");
const app = express();
const data = require("./history/data");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const SECRET = "asdjgasgdhbrkj%&$*t";
const verifyToken = require("./middleware/verifyToken");
app.use(cookieParser());
app.use(express.urlencoded());
let newData = data;

app.get("/", verifyToken, (req, res) => {
  const username = req.username; //cookie
  if (username) {
    res.redirect("user/" + username.username);
  } else {
    res.sendFile(path.join(__dirname, "public", "signIn.html"));
  }
});

app.get("/data", (req, res) => {
  res.send(newData);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("listening on *:3000");
});

app.post("/", (req, res) => {
  const username = req.body.username;
  const token = jwt.sign({ username }, SECRET);
  res.cookie("username", token, { maxAge: 6000000 });

  newData = newData.filter((element) => {
    return element != username;
  });
  newData.unshift(username);

  if (newData.length > 5) {
    newData = newData.slice(0, 5);
  }
  fs.writeFileSync("./history/data.json", JSON.stringify(newData));
  res.redirect("/user/" + username);
});

app.get("/user/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search.html"));
});

app.get("/log-out", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});
