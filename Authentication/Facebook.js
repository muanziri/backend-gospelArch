const passport=require('passport');


//require('dotenv').config();

const FacebookStrategy = require( 'passport-facebook' ).Strategy;

passport.serializeUser((user1 ,done)=>{
 
   done(null,user1.id);
   

})
passport.deserializeUser((id,done)=>{
  
  UserModel.findById(id).then((user)=>{
    
    done(null,user);
  })
  
})





var FACEBOOK_APP_ID='640091141092927'
var  FACEBOOK_APP_SECRET='8ed902c0bcc86de38b3244168e2b36d5'
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
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













