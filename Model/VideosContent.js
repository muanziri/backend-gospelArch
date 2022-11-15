const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    ContentID: {
        type: String,
        required: true
    },
   
    ProfilePhotoUrl: {
        type: String,
        
    },
    
    UserName: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    thumbnailId: {
        type: String,
        required: true
    },
    likes:{
     type:Number,
     required:true,
     default:0

    },
    pageNumber:{
     type:Number,
     required:true,
     default:1
    },
    CommentId: [String],
    CopyRightStatus:{
        type:Boolean,
        required:true,
        default:"False"
   
       },
    Date:{
        type: Date,
        required: true,
        default:Date.now

    }

})

const VideoContent=mongoose.model('VideoContent',UserSchema);
module.exports={VideoContent};