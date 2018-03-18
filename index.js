const express = require('express'),
      methodOverride= require('method-override');
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');
      expressSanitizer = require('express-sanitizer');
var app=express();
mongoose.connect("mongodb://localhost/BlogApp");
app.set("view engine","ejs");
app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
  title:String,
  img:String,
  body:String,
  date:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
      if (err) {
        res.send("Error");
      } else {
        res.render("index",{blogs:blogs});
      }
    });
});

app.get("/blogs/new",function(req,res){
  res.render("new");
});

app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function(err,newBlog){
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs")
    }
  });
});

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if (err) {
      res.send("Not Found");
    } else {
      res.render("show",{blog:foundBlog});
    }
  });
});

app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if (err) {
      res.send("Data Not Found");
    } else {
      res.render("edit",{blog:foundBlog});
    }
  });
});

app.put("/blogs/:id",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog){
    if (err) {
      res.send("Update UnSucessfull");
    } else {
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

app.delete("/blogs/:id",function(req,res){

  Blog.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(4000,function(){
  console.log("Server has Started");
});
