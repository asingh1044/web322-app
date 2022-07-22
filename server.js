/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ____Ajitpal Singh___ Student ID: ___113194211__________ Date: 2022-07-21________________
*
* Online (Heroku) Link:  _____https://stormy-refuge-11522.herokuapp.com/_____________________________________________
*
********************************************************************************/


var blogData = require('./blog-service.js')
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var path = require("path");


const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const upload = multer();
const { posts } = require("./blog-service");
const exphbs = require("express-handlebars");
const stripJs = require('strip-js');

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
 });

 app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  helpers: {
      navLink: function(url, options) {
          return '<li' + 
              ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
              '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
          if (arguments.length < 3)
              throw new Error("Handlebars Helper equal needs 2 parameters");
          if (lvalue != rvalue) {
              return options.inverse(this);
          } else {
              return options.fn(this);
          }
        },
        safeHTML: function(context){
          return stripJs(context);
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }
    },
     extname : 'hbs'
    }));

app.get('/', (req, res) => {
    res.redirect("/blog");
    })

      app.get("/about", (req, res) => {
        res.render("about")
      })
      
      /*app.get('/posts/add', (req, res) => {
       res.render("addPost")
      });*/

      app.get('/posts/add', (req, res) => {
        blogData.getCategories().then(categories => {
            res.render("addPost", {categories: categories})
        }).catch(() => {
            res.render("addPost", {categories: []});
        })
    });

      app.get("/categories/add", (req, res) => {
        res.render("addCategory")
    })

      app.get("/posts", (req, res) => {
        if(req.query.category) {
          blogData.getPostsByCategory(req.query.category).then(posts => {
            if (posts.length > 0) {
                res.render("posts", {posts: posts})
            } else {
                res.render("posts",{message: "no results"});
            }
        }).catch(err => {
              res.render("posts", { message: "no results" })
          })
        }
        else if (req.query.minDate) {
          blogData.getPostsByMinDate(req.query.minDate).then(posts => {
            if (posts.length > 0) {
                res.render("posts", {posts: posts})
            } else {
                res.render("posts",{message: "no results"});
            }
        }).catch(err => {
              res.render("posts", { message: "no results" })
          })
        }
        else{
          blogData.getAllPosts().then(posts => {
            if (posts.length > 0) {
                res.render("posts", {posts: posts})
            } else {
                res.render("posts",{message: "no results"});
            }
        }).catch(err => {
              res.render("posts", { message: "no results" })
          })
        }
      }) 

    app.get('/blog', async (req, res) => {

      // Declare an object to store properties for the view
      let viewData = {};
  
      try{
  
          // declare empty array to hold "post" objects
          let posts = [];
  
          // if there's a "category" query, filter the returned posts by category
          if(req.query.category){
              // Obtain the published "posts" by category
              posts = await blogData.getPublishedPostsByCategory(req.query.category);
          }else{
              // Obtain the published "posts"
              posts = await blogData.getPublishedPosts();
          }
  
          // sort the published posts by postDate
          posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
  
          // get the latest post from the front of the list (element 0)
          let post = posts[0]; 
  
          // store the "posts" and "post" data in the viewData object (to be passed to the view)
          viewData.posts = posts;
          viewData.post = post;
  
      }catch(err){
          viewData.message = "no results";
      }
  
      try{
          // Obtain the full list of "categories"
          let categories = await blogData.getCategories();
  
          // store the "categories" data in the viewData object (to be passed to the view)
          viewData.categories = categories;
      }catch(err){
          viewData.categoriesMessage = "no results"
      }
  
      // render the "blog" view with all of the data (viewData)
      res.render("blog", {data: viewData})
  
  });

  app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogData.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogData.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

      app.get("/categories", (req,res) =>{
        blogData.getCategories().then(categories => {
          if (categories.length > 0) {
              res.render("categories", { categories })
          } else {
              res.render("categories",{message: "no results"});
          }
      }).catch(err => {
          res.render("categories", { message: "no results" })
      })
    })  
          
      app.get('/post/:value', (req,res) => {
        blogData.getPostById(req.params.value).then((data) => {
            res.json({data});
            }).catch((err) => {
            res.json({message: err});
            })
          });
            
    cloudinary.config({
      cloud_name: 'ajit123',
      api_key: '739878326881239',
      api_secret: 'laKpwmeEsfidwrzSJKs7T7eTVCU',
      secure: true
      });

      app.post('/posts/add', upload.single('featureImage'), function (req, res, next) {
        if (req.file) {
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                        }}
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            async function upload(req) {
                let result = await streamUpload(req);
                console.log(result);
                return result;
            }
            upload(req).then((uploaded)=>{
                req.body.featureImage = uploaded.url;
                blogData.addPost({
                    body: req.body.body,
                    title: req.body.title,
                    category: req.body.category,
                    featureImage: req.body.featureImage,
                    published: !!req.body.published
                }).then(() => {
                    res.redirect("/posts")
                })
            });
        } else {
            blogData.addPost({
                body: req.body.body,
                title: req.body.title,
                category: req.body.category,
                featureImage: "",
                published: !!req.body.published
            }).then(() => {
                res.redirect("/posts")
            })
        }
        
    });


      app.post("/categories/add", (req, res) => {
        let categoriesData = {
            category: req.body.category
        }
        blogData.addCategory(categoriesData).then(() => {
            res.redirect("/categories")
        }).catch(err => {
            res.status(500).send(err)
        })
    })

      app.get("/categories/delete/:id", (req, res) => {
        blogData.deleteCategoryById(req.params.id).then(() => {
          res.redirect("/categories")
      }).catch(err => {
          res.status(500).send("Unable to Remove Category / Category not found")
      })
    })
  
      app.get("/posts/delete/:id", (req, res) => {
        blogData.deletePostById(req.params.id).then(() => {
          res.redirect("/posts")
      }).catch(err => {
          res.status(500).send("Unable to Remove Post / Post not found")
      })
    })
  

      app.use((req,res)=>{
        res.status(404).render("404")
    })

      blogData.initialize().then(() => {
        app.listen(PORT,  () => {
            console.log('Express HTTP server is listening to the port', PORT)
        })
    }).catch((err) => {
        console.log(err);
    })
  