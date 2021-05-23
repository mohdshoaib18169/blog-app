   var bodyparser   = require("body-parser"),
       express      = require("express"),
       mongoose     = require("mongoose"),
       expressSanitizer = require("express-sanitizer");
       methodOverride = require("method-override");
       mongoose.set('useFindAndModify', false);
    app          =express(),
    path = require('path');
    app.use(express.static("static"));
    mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
    app.set("view engine","ejs");
    app.use(methodOverride("_method"));
    app.use(expressSanitizer());

    app. use(express. static(path. join(__dirname, 'public')));

    app.use(bodyparser.urlencoded({extended: true}));
    var blogSchema = new mongoose.Schema({
      title: String,
      image: String,
      body: String,
      created: {type: Date, default: Date.now}

    });
    var blog = mongoose.model("blog",blogSchema);
  //  blog.create({
    //  title: "Test Blog",
    //   image: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  //     body: "hello this is a blog post!",

  //  });

    app.get("/", function(req, res){
      res.redirect("/blogs");
    });
// index
    app.get("/blogs", function(req, res){
      blog.find({}, function(err, blogs){
        if(err){
        console.log("error");
      }
        else{
          res.render("index", {blogs: blogs});
        }
      });

    });
    // new blog
    app.get("/blogs/new",function(req,res){
      res.render("new.ejs");
    });
    // create
 app.post("/blogs",function(req,res){

   req.body.blog.body=req.sanitize(req.body.blog.body);

   blog.create(req.body.blog,function(err,newblog){
     if(err){
       res.render("new");
     }
     else{
       res.redirect("/blogs");
     }
   });
 });
 // show
 app.get("/blogs/:id",function(req, res){
   blog.findById(req.params.id,function(err, foundBlog){
     if(err){
     res.redirect("/blogs");
   }
   else {
     res.render("show", {blog: foundBlog});
   }
 });
 });
 // edit route
 app.get("/blogs/:id/edit", function(req, res){
   blog.findById(req.params.id, function(err, blogfound){
     if(err)
     {
       res.redirect("/blogs");
     }
     else {
       {
         res.render("edit", {blog: blogfound});
       }
     }
   })
 })
 //update route

 app.put("/blogs/:id", function(req, res){
   req.body.blog.body=req.sanitize(req.body.blog.body);
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
     if(err){
     res.redirect("/blogs");
   }
   else
     {
       res.redirect("/blogs/"+req.params.id);
     }

   });

 });

 // delete blogs
 app.delete("/blogs/:id/delete", function(req, res){
   blog.findByIdAndRemove(req.params.id, function(err, body){
     if(err)
     res.redirect("/blogs");
     else {
        res.redirect("/blogs");
     }

   });
 });

    app.listen(7860,function(){
      console.log("your blogapp is running");
    });
