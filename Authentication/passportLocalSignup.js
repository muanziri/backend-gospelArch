var passport = require('passport');
const {UserModel}=require('../Model/user')
const {TokenGenerator,verifier} = require('../Authentication/JWT')
const key= require('../gospleKeys.json')
const { google } = require('googleapis');
var drive = google.drive("v3");
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
var LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function (results, done) {
done(null, results.id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id).then((user)=>{
    done(null,user);
  })
 });


passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function (req, username, password, done) {
  let name=req.body.name;
  let email=req.body.email;
  let phone=req.body.phone;
  var folderId='1Xw8Ydiou9iCpS5jybiaqjmT_bR0GaRcm'
  var folderName=name  
  var fileMetadataa = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder',
        parents: [folderId]
  }
  
  let AuthIdentity=TokenGenerator(email,password)
  UserModel.findOne({Email:email}).then((results)=>{
    if(results == null){
      drive.files.create({
        auth: jwToken,
        resource: fileMetadataa,
        fields: 'id'
      },function (err,file){
       
      new UserModel({
        Email:email,
        AuthId:AuthIdentity,
        Phone:phone,
        userName:name,
        folderId:file.data.id 
      }).save().then((results)=>{
        done(null, results)
      })
    })
    }else{
      done(null, false);
    }
    
   })
  
 
}
))