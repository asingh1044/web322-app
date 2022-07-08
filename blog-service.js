const fs = require("fs");
const { resolve } = require("path");

let posts = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
               categories = JSON.parse(data);
                   resolve(data);
                    }
                });
            }
        });
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve,reject)=>{
           if (posts.length > 0 ) {
             resolve(posts) 
            } else {
              reject("no results returned"); 
            }
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        if (posts.length > 0) {
                 resolve(posts.filter(post => post.published))
        } else {
             reject("no results returned");
        }
            
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
       if (categories.length > 0 ) {
            resolve(categories)
        } else {
            reject("no results returned");
        }  
    });
}

module.exports.addPost=function(postData){
    postData.published==undefined ? postData.published = false : postData.published = true;
    postData.id = posts.length + 1;
    postData.postDate = datePattern()
    posts.push(postData)
    return new Promise((resolve, reject) => {
        if (posts.length ==0 ) {
            reject("no results returned")
        } else {
            resolve(posts)
        }
    });
}    

function datePattern() {
    let date = new Date()
    let year = date.getFullYear()
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    return [year, month, day].join('-')
}

module.exports.getPostsByCategory= function(category){
    return new Promise((resolve, reject) => {
        postByCategory = [];
        for (let index = 0; index < posts.length; index++) {
            if (posts[index].category == category) {
                postByCategory.push(posts[index]);
            }
        }
        if (postByCategory.length === 0) {
            reject('No results returned')
        } else {    
        return resolve(postByCategory)
        }
    })
}

   module.exports.getPostsByMinDate = function(minDateStr){
       var minDatePost =[];
       var promise = new Promise((resolve, reject) => {
         if(posts.length === 0) {
             reject("no results returned");
         } else{
        for(var i =0; i < posts.length; i++) {
             if(new Date(posts[i].postDate) >= new Date(minDateStr)){
                minDatePost.push(posts[i]);
             }
         }
     }
        resolve(minDatePost);
    })
        return promise;
}
   

module.exports.getPostById=function(id){
    return new Promise((resolve, reject) => {
        let postByid = null;
        for (let index = 0; index < posts.length; index++) {
            if (posts[index].id == id) {
                postByid = posts[index];
                break;
            }
        }
        if (postByid === null) reject('No results returned')
        return resolve(postByid)
    })
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        (posts.length > 0) ? resolve(posts.filter(post => post.published && post.category == category)) : reject("no results returned");
    });
}
