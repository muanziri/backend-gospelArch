const passport=require('passport');
const { UserModel } = require('../Model/user');
const {TokenGenerator,verifier} = require('./JWT')
const LocalStrategy=require('passport-local').Strategy
passport.serializeUser((user1 ,done)=>{
 
    done(null,user1.id);
    
 
 })
 passport.deserializeUser((id,done)=>{
   
   UserModel.findById(id).then((user)=>{
     
     done(null,user);
   })
   
 })
passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true 
},
    function(req,email, password,done){
     
      UserModel.findOne({ Email: email }).then((user)=>{
        if (!user) { return done(null, false); }else{
          let CheckPassword=verifier(user.AuthId,req.body.password)
         if (CheckPassword !== email) { return done(null, false); }else{
            return done(null, user);
          }
        }
      })
    }
  ));