const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    ProfilePhotoUrl: {
        type: String,
        
    },
    Notification: {
        type: String,
        
    },
    createdAt: { type: Date, expires: '7d', default: Date.now }

})

const Notification=mongoose.model('Notification',UserSchema);
module.exports={Notification};