const fs = require("fs");

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
    posts.push(postData)
    return new Promise((resolve, reject) => {
        if (posts.length ==0 ) {
            reject("no results returned")
        } else {
            resolve(posts)
        }
    });
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

module.exports.getPostsByMinDate=function(minDate){
    return new Promise((resolve, reject) => {
        postByminDate = [];
        for (let index = 0; index < posts.length; index++) {
            if (Date(posts[index].minDate) >= Date(minDateStr)) {
                postByminDate.push(posts[index]);
            }
        }
        if (postByminDate.length === 0) {
            reject('No results returned')
        } else{
        return resolve(postByminDate)
        }
    })
}

module.exports.getPostById=function(id){
    return new Promise((resolve, reject) => {
        postByid = [];
        for (let index = 0; index < posts.length; index++) {
            if (posts[index].id == id) {
                postByid.push(posts[index]);
            }
        }
        if (postByid.length === 0) {
            reject('No results returned')
        } else{
        return resolve(postByid)
        }
    })
}