

var jwt = require('jsonwebtoken');
const { UserModel } = require('../Model/user');

function TokenGenerator (key,secret){
  return jwt.sign(key, secret);
}
function verifier (key,secret){
   return jwt.verify(key, secret);
  
}


module.exports={TokenGenerator,verifier}