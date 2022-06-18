/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ____Ajitpal Singh___ Student ID: ___113194211__________ Date: 2022-06-17________________
*
* Online (Heroku) Link:  _________https://protected-spire-60037.herokuapp.com/about_________________________________________
*
********************************************************************************/


var blogservice = require('./blog-service.js')
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var path = require("path");

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const upload = multer();
const { posts } = require("./blog-service");

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/about");
    })

      app.get("/about", (req,res) =>{
        res.sendFile(path.join(__dirname,"/views/about.html"));
      });

      app.get("/posts/add", (req,res) =>{
        
        res.sendFile(path.join(__dirname,"/views/addPost.html"));
      });

      app.get("/posts", (req, res) => {
        if(req.query.category) {
          blogservice.getPostsByCategory(req.query.category).then((data) => {
            res.json({data});
          }).catch((err) => {
            res.json({message: err});
          })
        }
        else if (req.query.minDate) {
          blogservice.getPostsByMinDate(req.query.category).then((data) => {
            res.json({data});
          }).catch((err) => {
            res.json({message: err});
          })
        }
        else{
          blogservice.getAllPosts(req.query.category).then((data) => {
            res.json({data});
          }).catch((err) =>{
            res.json({message: err});
          })
        }
      }) 

      app.get('/blog', (req,res)=>{
        blogservice.getPublishedPosts().then((data=>{
            res.json(data);
        })).catch(err=>{
            res.json({message: err});
        });
    }); 

      app.get("/categories", (req,res) =>{
        blogservice.getCategories().then((data) =>{
            res.json({data});
        }).catch((err) =>
         res.json({message: err}))
        })  
          
      app.get('/post/:value', (req,res) => {
        blogservice.getPostById(req.params.value).then((data) => {
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
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
           let stream = cloudinary.uploader.upload_stream(
             (error, result) => {
                if (result) {
                   resolve(result);
                } else {
                 reject(error);
                }
              }
           );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
       };

       async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
       }
       upload(req).then((uploaded)=> {
        req.body.featureImage = uploaded.url;
        blogservice.addPost(req.body).then(() => {
          res.redirect("/posts");
      })
       });
      });

   
      app.use((req, res) => {
        res.status(404).send("You've found a page that doesn't exist. <br> Sorry, we looked everywhere but couldn't find it. <br> Breathe in, and on the out breath, go back and try again.")
      });

      blogservice.initialize().then(() => {
        app.listen(PORT,  () => {
            console.log('Express HTTP server is listening to the port', PORT)
        })
    }).catch((err) => {
        console.log(err);
    })
  