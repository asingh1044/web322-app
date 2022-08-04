const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema;

const historySchema = new Schema({
    dateTime: Date,
    userAgent: String
})

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [historySchema]
})

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://dbUser:simran9211@senecaweb.rknco.mongodb.net/?retryWrites=true&w=majority");
    db.on('error', (err)=>{
    reject(err); // reject the promise with the provided error
    });
    db.once('open', ()=>{
    User = db.model("users", userSchema);
    resolve();
    });
    });
   };

   module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password === userData.password2) {

            bcrypt.hash(userData.password, 10).then(hash => {

                userData.password = hash;
                let newUser = new User(userData);

                newUser.save().then(() => {
                    resolve()
                }).catch(err => {
                    if (err.code == 11000) {
                        reject("Username already taken")
                    } else {
                        reject("There was an error creating the user:", err);
                    }
                })

            }).catch(() => {
                reject("There was an error encrypting the password")
            })

        } else {
            reject("Passwords do not match")
        }
    })
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {

        User.find({ userName: userData.userName }).then(users => {
            if (users.length === 0) {

                reject("Unable to find user:", userData.userName)

            } else {

                bcrypt.compare(userData.password, users[0].password).then(result => {

                    if (result === true) {
                        
                        users[0].loginHistory.push({
                            dateTime: (new Date()).toString(),
                            userAgent: userData.userAgent
                        })
                        User.update({ userName: userData.userName }, { $set: { loginHistory: users[0].loginHistory }}).then(() => {
                            resolve(users[0])
                        }).catch(err => {
                            reject("There was an error verifying the user:", err)
                        })
                    } else {
                        reject("Incorrect password for user:", userData.userName)
                    }
                })

            }
        }).catch(() => {
            reject("Unable to find user:", userData.userName)
        })
    })
}
