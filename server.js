/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: ____Ajitpal Singh___ Student ID: ___113194211__________ Date: 2022-06-01________________
*
* Online (Heroku) Link:  ____https://protected-spire-60037.herokuapp.com/__________________________________________________
*
********************************************************************************/


var blogservice = require('./blog-service.js')
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var path = require("path");

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/about");
    })

    app.get("/about", (req,res) =>{
        res.sendFile(path.join(__dirname,"/views/about.html"));
      });

      app.get("/posts", (req,res) =>{
        res.sendFile(path.join(__dirname,"/data/posts.json"));
      });

      app.get("/categories", (req,res) =>{
        res.sendFile(path.join(__dirname,"/data/categories.json"));
      });

      app.get("/blog", (req,res) =>{
        res.sendFile(path.join(__dirname,"/data/posts.json"));
      });


      app.get("/posts", (req,res) =>{
        blogservice.getAllPosts().then((data) =>{
            res.json({data});
        }).catch((err) =>
        res.json({message: err}))
        })
 
      app.get("/categories", (req,res) =>{
        blogservice.getCategories().then((data) =>{
            res.json({data});
        }).catch((err) =>
         res.json({message: err}))
        })  

       app.get("/blog", (req,res) =>{
         blogservice.getPublishedPosts().then((data) =>{
            res.json({data});
        }).catch((err) =>
            res.json({message: err}))
        })      

        
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

