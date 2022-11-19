const passport=require('passport');
const { UserModel } = require('../Model/user');
const {TokenGenerator,verifier} = require('./JWT')
const LocalStrategy=require('passport-local').Strategy
passport.serializeUser((user1 ,done)=>{
  console.log(user1)
    //done(null,user);
    
 
 })
 passport.deserializeUser((id,done)=>{
   console.log(id)
  //  UserModel.findById(id).then((user)=>{
  //    console.log(user)
  //   done(null,user);
  //  })
   
 })
passport.use(new LocalStrategy({
  usernameField : 'Email',
  passwordField : 'password',
  passReqToCallback : true 
},
    function(req,Email, password,done){
      UserModel.findOne({ Email: Email }).then((user1)=>{
        if (!user1) { return done(null, false); }else{
          let CheckPassword=verifier(user1.AuthId,Email)
          //console.log(CheckPassword)
         if (CheckPassword !== password) { return done(null, false); }else{
          
            return done(null,user1)
          }
        }
      })
    }
  ));