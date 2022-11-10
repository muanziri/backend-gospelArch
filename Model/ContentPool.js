const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    ProfilePhotoUrl: {
        type: String,
        
    },
    Duration: {
        type: String,
    },
    CopyRightStatus: {
        type: Boolean,
        required:true,
        default:false
        
    },
    ThumbnailId: {
        type: String,
        required:true,
        
        
    },
    VideoId: {
        type: String,
        required:true,
        
        
    },
    Title: {
        type: String,
        required:true,
        
        
    },
    showDownloadButton:{
        type:Boolean,
        required:true,
        default:true
    },
    private:{
     type:Boolean,
     required:true,
     default:false
    },
    allowCommenting:{
        type:Boolean,
        required:true,
        default:true
    },
    Category: {
        type: String,
        required: true
    },
    Views: {
        type: Number,
        required:true,
        default:0 
    },
    CommentsIds: [String],
    Likes: [String],
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const VideoContent=mongoose.model('ContentPool',UserSchema);
module.exports={VideoContent};