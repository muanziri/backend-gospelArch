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
    Comment: {
        type: String,
        
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const Comment=mongoose.model('CommentPool',UserSchema);
module.exports={Comment};