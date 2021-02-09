// User model here
const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel