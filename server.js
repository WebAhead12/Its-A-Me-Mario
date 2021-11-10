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
  const account = req.account; //cookie
  if (account) {
    res.redirect("user/" + account.username);
  } else {
    res.sendFile(path.join(__dirname, "public", "signIn.html"));
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("listening on *:3000");
});

app.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = jwt.sign({ "username": username, "password": password }, SECRET);
  let element = newData.find(element => username == element.username)
  if (element) {
    if (element.password == password) {
      res.cookie("account", token, { maxAge: 6000000 });
      res.redirect("/user/" + username);
    } else {
      console.log("Incorrect password!");
      res.redirect("/?data=incorrect")
    }
  } else {
    res.cookie("account", token, { maxAge: 6000000 });
    newData = newData.filter((element) => {
      return element.username != username;
    });
    newData.unshift({ username, password });
    if (newData.length > 5) {
      newData = newData.slice(0, 5);
    }
    fs.writeFileSync("./history/data.json", JSON.stringify(newData));
    res.redirect("/user/" + username);
  }

});

app.get("/user/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search.html"));
});

app.get("/log-out", (req, res) => {
  res.clearCookie("account");
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.redirect("/");
})