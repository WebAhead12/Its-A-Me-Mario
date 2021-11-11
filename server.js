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
let PORT = process.env.PORT || 3000;

//home page
app.get("/", verifyToken, (req, res) => {
  //checks if there is an account, if there is redirects it to the profile page
  const account = req.account; //cookie
  if (account) {
    res.redirect("user/" + account.username);
  } else {
    //if not requests a signIn
    res.sendFile(path.join(__dirname, "public", "signIn.html"));
  }
});
//reads the public file
app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:" + PORT);
});
//when an account registered in it creates a cookie account
app.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = jwt.sign({ username: username, password: password }, SECRET);
  let element = newData.find((element) => username == element.username);
  if (element) {
    if (element.password == password) {
      res.cookie("account", token, { maxAge: 6000000 });
      res.redirect("/user/" + username);
    } else {
      console.log("Incorrect password!");
      res.redirect("/?data=incorrect");
    }
  } else {
    res.cookie("account", token, { maxAge: 6000000 });
    newData = newData.filter((element) => {
      return element.username != username;
    }); //adds it to the date.json
    newData.unshift({ username, password });
    if (newData.length > 5) {
      newData = newData.slice(0, 5);
    }
    fs.writeFileSync("./history/data.json", JSON.stringify(newData));
    res.redirect("/user/" + username);
  }
});
//when an account is signed in it redirects it to the search page
app.get("/user/:name", verifyToken, (req, res) => {
  const account = req.account;
  if (!account) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "public", "search.html"));
  }
});
//logout clears the account cookie
app.get("/log-out", (req, res) => {
  res.clearCookie("account");
  res.redirect("/");
});
//any url that isnt identified redircts it the home page
app.get("*", (req, res) => {
  res.redirect("/");
});
