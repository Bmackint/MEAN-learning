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

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.connect
  })
  Post.updateOne({_id: req.params.id}, post).then(result =>{
    console.log("**********update result ***************", result);
    res.status(200).json({message: "update successful!"});
  });
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents =>{
      res.status(200).json({
        message: 'get posts, success!',
        posts: documents
      });
    }); //all results

}); 

app.get("/api/posts/:id", (req, res, next) => {
  console.log(req.body);
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });

})

app.delete('/api/posts/:id', (req, res, next) => {

  Post.deleteOne({_id: req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });
});
module.exports = app;
