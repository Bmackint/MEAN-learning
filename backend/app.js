const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

app.use((req, res, next) => { 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", 
  "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  ); 
  next();
 
})

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: "post added successfully",   
        postId: createdPost.id
      });
    }); // persist to the db

});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents =>{
      console.log(documents);
      res.status(200).json({
        message: 'get posts, success!',
        posts: documents
      });
    }); //all results

}); 

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });
});
module.exports = app;
