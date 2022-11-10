const passport=require('passport');
const { google } = require('googleapis');
var drive = google.drive("v3");

const {UserModel}=require('../Model/user')
const key= require('../gospleKeys.json')
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});
//require('dotenv').config();

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport.deserializeUser((id,done)=>{
  
  UserModel.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var GOOGLE_CLIENT_ID='543387170902-as6v4dkir9vjfoqe99tel8t7b477jss8.apps.googleusercontent.com'
var GOOGLE_CLIENT_SECRET='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'
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {

    var folderId='1Xw8Ydiou9iCpS5jybiaqjmT_bR0GaRcm'
    var folderName=profile.displayName   
    var fileMetadataa = {
          'name': folderName,
          'mimeType': 'application/vnd.google-apps.folder',
          parents: [folderId]
    }
    
    
  

 
    UserModel.findOne({AuthId:profile.id}).then((currentUser)=>{
      if(currentUser){
        console.log('u are loged in as '+currentUser.userName);
        done(null,currentUser);
     }else{
      drive.files.create({
        auth: jwToken,
        resource: fileMetadataa,
        fields: 'id'
      },function (err,file){
        console.log(file)
      new UserModel({
        userName:profile.displayName,
        Email:profile.emails[0].value,
        AuthId:profile.id,
        ProfilePhotoUrl:profile.photos[0].value,
        folderId:file.data.id
      }).save().then((user1)=>{
        done(null,user1)
      })
    })
      }});

     
  
      
  
  
      }));













