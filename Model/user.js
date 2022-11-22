const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    ProfilePhotoUrl: {
        type: String,
        
    },
    AuthId: {
        type: String,
        required: true
    },
    supportAmmount:{
        type:Number,
        required:true,
        default:0
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    folderId: {
        type: String,
        
    },
    paymentId: {
        type: String,
    },
    likes:{
     type:Number,
     required:true,
     default:0

    },
    CommentId: [String],
    notifications: [String],
    History: [String],
    WatchLater: [String],
    PostsIds: [String],
    phoneNumber:{
        type: String,
        
    },
    showSupportButton:{
        type:Boolean,
        required:true,
        default:true
    },
    showAccountPerfomance:{
        type:Boolean,
        required:true,
        default:true
    },
    resetPin:{
        type:Number,
        required:true,
        default:00000
    },
    AccountActivated:{
        type:Boolean,
        required:true,
        default:false
    },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const UserModel=mongoose.model('users',UserSchema);
module.exports={UserModel};