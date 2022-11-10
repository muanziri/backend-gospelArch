// verify a token symmetric - synchronous

var jwt = require('jsonwebtoken');
const { UserModel } = require('../Model/user');
const passport=require('passport');

passport.serializeUser((user1 ,done)=>{
 
    done(null,user1.id);
    
 
 })
 passport.deserializeUser((id,done)=>{
   
   UserModel.findById(id).then((user)=>{
     
     done(null,user);
   })
   
 })
 
 
function TokenGenerator (key,secret){
  return jwt.sign(key, secret);
}
function verifier (key,secret){
   return jwt.verify(key, secret);
  
}

// function signUp(Name,Email,Password){
//     const AuthId=TokenGenerator(Email,Password)
//     new UserModel({
//         userName:Name,
//         Email:Email,
//         AuthId:AuthId
//       }).save().then((user1)=>{
//         done(null,user1)
//       }) 

// }
// function signIn(Email,Password){
//     UserModel.findOne({Email:Email}).then((result)=>{
//         if(result){
//        let AuthId=result.AuthId;
//        verifier(AuthId,Password);
//        done(null,result)
//           }else{
//         return null
//     }
//     })

// }

module.exports={TokenGenerator,verifier}