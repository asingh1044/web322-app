/*const fs = require("fs");
const { resolve } = require("path");

let posts = [];
let categories = [];*/

const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

var sequelize = new Sequelize('d741t2n0i12jmt', 'wuceawoiocigow', 'cc3359ca402542e691b58e43b66a7d99370bb50f2d80db57131c361085017159', {
 host: 'ec2-44-195-162-77.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 },
 query: { raw: true }
});

var Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
})

var Category = sequelize.define("Category", {
    category: Sequelize.STRING
})

Post.belongsTo(Category, { foreignKey: 'category' })

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve()
        }).catch(err => {
            reject("Unable to sync the database")
        });
    });
}
    
module.exports.getAllPosts = function() {
    return new Promise((resolve,reject)=>{
        Post.findAll().then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        })
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        Post.findAll({ 
            where: { 
                published: true 
            } 
        }).then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        });
    });   
    }

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        Category.findAll().then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        });
    });
    }

module.exports.addPost=function(postData){
    console.log(postData);
    postData.published = (postData.published) ? true : false;
    postData.postDate = new Date();

    for (let key in postData) {
        if (postData[key] === "") {
            postData[key] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Post.create(postData).then(() => { 
            resolve()
        }).catch(err => { 
            reject("Unable to create post") 
        });
    })
}

module.exports.getPostsByCategory= function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({ 
            where: { 
                category: category
            } 
        }).then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        });
    })
}

   module.exports.getPostsByMinDate = function(minDateStr){
       var minDatePost =[];
       return new Promise((resolve, reject) => {
        Post.findAll({ 
            where: { 
                postDate: { 
                    [gte]: new Date(minDate) 
                } 
            }
        }).then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        });
    })
}
   

module.exports.getPostById=function(id){
    return new Promise((resolve, reject) => {
        Post.findAll({ 
            where: { 
                id: id
            } 
        }).then(data => { 
            resolve(data[0]) 
        }).catch(err => { 
            reject("no results returned") 
        });
    })
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({ 
            where: { 
                published: true, 
                category: category
            } 
        }).then(data => { 
            resolve(data) 
        }).catch(err => { 
            reject("no results returned") 
        })
    });
}


module.exports.addCategory = function(categoryData){
    for (let key in categoryData) {
        if (categoryData[key] === "") {
            categoryData[key] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Category.create(categoryData).then(() => { 
            resolve() 
        }).catch(err => { 
            reject("Unable to create category") 
        });
    })
}

module.exports.deleteCategoryById = function(id) {
    return new Promise((resolve, reject) => {
        Category.destroy({ 
            where: { 
                id: id
             } 
        }).then(() => { 
            resolve()
        }).catch(err => { 
             reject("Unable to delete category") 
        })
    })
}

module.exports.deletePostById = function(id) {
    return new Promise((resolve, reject) => {
        Post.destroy({ 
            where: { 
                id: id
            } 
        }).then(() => { 
            resolve() 
        }).catch(err => { 
            reject("Unable to delete post")
        })
    })
}

