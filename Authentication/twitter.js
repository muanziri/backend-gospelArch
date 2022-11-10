const passport=require('passport');


//require('dotenv').config();

const TwitterStrategy = require( 'passport-twitter' ).Strategy;

passport.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport.deserializeUser((id,done)=>{
  
  UserModel.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var TWITTER_CONSUMER_KEY='79374043564-c8luht2492rlm4la2tdpvuv9h5ctcvuk.apps.googleusercontent.com'
var TWITTER_CONSUMER_SECRET='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'
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {

  

    
    console.log(profile)

 
    // UserModel.findOne({AuthId:profile.id}).then((currentUser)=>{
    //   if(currentUser){
    //     console.log('u are loged in as '+currentUser.userName);
    //     done(null,currentUser);
    //  }else{
    //   new paymentMonth({
    //     userName:profile.displayName,
    //   }).save(); 
    //   var folderId = "1WhwVTQycr7uyO2r_kiGPE38VunkC-njB";
    //   var folderName=profile.displayName   
    //   var fileMetadataa = {
    //         'name': folderName,
    //         'mimeType': 'application/vnd.google-apps.folder',
    //         parents: [folderId]
    //   }
    //      const uploadToTheDriveMakeFOlder= (fileMetadata)=>{
       
    //         // console.log(file)
           
    
             
    //             drive.files.create({
    //               auth: jwToken,
    //               resource: fileMetadata,
    //               fields: 'id'
    //             }, function(err, file) {
    //               if (err) {
    //                 // Handle error
    //                 console.error(err);
    //               } else {
               
    //             new UserModel({
    //               userName:profile.displayName,
    //               Email:profile.emails[0].value,
    //               AuthId:profile.id,
    //               ProfilePhotoUrl:profile.photos[0].value,
    //               folderId:file.data.id
    //             }).save().then((user1)=>{
    //               done(null,user1)
    //             })
    //           } 
          
    //         })
        
    //     }
    //     uploadToTheDriveMakeFOlder(fileMetadataa);
    //   }});

     
  
      
  
  
      }));













