const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const Post = require('./models/post'); //convention is to use CAPS for model const

const app = express();

mongoose.connect('mongodb+srv://billy:XkDz4VMf3odwkDtv@cluster0-wtwhu.mongodb.net/node-angular?retryWrites=true&w=majority')//'node-angular' is name of db in cluster to auto gen
.then(()=> {
  console.log("connected to db!");
})
.catch((err)=> {
  console.log("connection failed.")
  console.log(err); 
});

app.use(bodyParser.json()); // add body-parser middleware to access request data easily
app.use(bodyParser.urlencoded({extended: false})); // able to parse url encoded data
app.use("/images", express.static(path.join("backend/images"))); //any request targetting /images will be allowed


app.use((req, res, next) => { 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", 
  "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  ); 
  next();
 
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
