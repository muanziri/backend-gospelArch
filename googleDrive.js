
const { google } = require('googleapis');
const {UserModel}=require('./model/users')
const recordings=require('./model/recordings')
const key= require('./duterestory-ecc42c3b6063.json')
const {paymentWeek,paymentMonth,paymentYear} = require('./model/moneyMakers');
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
  const totheDrivers= (fileMetadata,media,RecordTitle,stringedFilePath,user,folderIda,NewsBody)=>{
    drive.files.create({
     auth: jwToken,
     resource: fileMetadata,
     media: media,
     fields: 'id',
     onUploadProgress: evt => {
      const progress = (evt.bytesRead / fileSize) * 100;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${Math.round(progress)}% complete`);
    },
   }, function(err, file) {
     if (err) {
       // Handle error
       console.error(err);
     } else {
      
       console.log('File Id: ', file.data.id);
       console.log(user.id)
    
       UserModel.updateOne({userName:user.userName},{$addToSet:{Recordings:file.data.id}},function (err, docs) {
      if (err){
          console.log(err)
      }
  })
  UserModel.updateOne({userName:user.userName},{$addToSet:{titleRecordings:RecordTitle}},function (err, docs) {
    if (err){
        console.log(err)
    }
})
  new recordings({
    RecordingId:file.data.id,
    userId:user.id,
    UserName:user.userName,
    UserProfile:user.ProfilePhotoUrl,
    Title:RecordTitle,
    newsBody:NewsBody
  }).save().then(()=>{}).catch((err)=>{if(err) throw err})
    
     }
   });
   }
   const totheDriversWhatsapp= (fileMetadata,media,user)=>{
    drive.files.create({
     auth: jwToken,
     resource: fileMetadata,
     media: media,
     fields: 'id',
  
   },async function(err, file) {
     if (err) {
       // Handle error
       console.error(err);
     } else {
      
       console.log('File Id: ', file.data.id);
       const transactionDetailsM =await paymentMonth.find({userName:user.userName});
       const transactionDetailsW=await  paymentWeek.find({userName:user.userName});
       const transactionDetailsY=await  paymentYear.find({userName:user.userName});
    
       if (transactionDetailsM.length >0){
        paymentMonth.updateOne({userName:user.userName}, { $addToSet: { WhatsappScreenShotPosts: file.data.id } }, 
          function (err, docs) {
          if (err) throw err
        })
       }else if(transactionDetailsW.length >0){
        paymentWeek.updateOne({userName:user.userName}, { $addToSet: { WhatsappScreenShotPosts: file.data.id } }, function (err, docs) {
          if (err) {
            console.log(err)
          }
        })
       }else if(transactionDetailsY.length >0){
        paymentYear.updateOne({userName:user.userName}, { $addToSet: { WhatsappScreenShotPosts: file.data.id } }, function (err, docs) {
          if (err) {
            console.log(err)
          }
        })
       } 
    
     }
   });
   }
   const ChangeProfilePic= (fileMetadata,media,user)=>{
    drive.files.create({
     auth: jwToken,
     resource: fileMetadata,
     media: media,
     fields: 'id',
  
   },async function(err, file) {
     if (err) {
       // Handle error
       console.error(err);
     } else {
      let query='https://drive.google.com/uc?export=download&id='+file.data.id;
      UserModel.updateOne({userName:user.userName},{ProfilePhotoUrl:query},function (err, docs) {
        if (err){
            console.log(err)
        }
    })
    recordings.updateMany({UserName:user.userName},{UserProfile:query},function (err, docs) {
      if (err){
          console.log(err)
      }
  })
    
     }
   });
   }
   const DeleteFile=(fileId)=>{
    var request = drive.files.delete({
      'fileId': fileId
    });
    request.execute(function(resp) { });
   }
   module.exports={totheDrivers,totheDriversWhatsapp,ChangeProfilePic,DeleteFile};