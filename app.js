var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');


//App Config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //This has to be after body parser
app.use(methodOverride("_method"));

//Mongoose model config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1465158753229-aa725fff85a1?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=1b1d5afac6ea6583b441b809b188bdae",
//     body: "This is growing to be something unbelievably awesome. I'm learning to create the world! Yeah!"
// },function(err,blog) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(blog);
//     }
// });

//Routes
app.get("/",function(req,res) {
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res) {
    Blog.find({}, function(err,blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {
                blogs: blogs
            })
        }
    });
});

app.get("/blogs/new", function(req,res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function(req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,blog) {
        if(err) {
            console.log(err);
            res.render("new");
        } else {
            console.log(blog.title +" post is successfully inserted");
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function(req,res) {
    var id = req.params.id;
    Blog.findById(id,function(err,foundBlog) {
        if(err) {
            res.render("/");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

//edit Route
app.get("/blogs/:id/edit", function(req,res) {
    Blog.findById(req.params.id, function(err,foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {
                blog: foundBlog
            });
        }
    });
});

//Update route
app.put("/blogs/:id", function(req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

//Destroy route
app.delete("/blogs/:id", function(req,res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});


app.listen(3000,function() {
    console.log("Server is running at port 3000");
});

//title
//imageURL
//Body
//Created Date