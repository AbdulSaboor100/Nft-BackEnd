import express from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import Token from '../models/tokenSchema.js'

const app = express.Router();
app.use(bodyParser.json({ limit: '2mb' }));

async function passwordHashedFunc(password) {
    let saltRounds = 10;
    let HashPassword = await bcrypt.hash(password, saltRounds);
    return HashPassword;
  }
  
  async function tokenGenerator(userDetails) {
    let { email, password, username , _id } = userDetails;
    let jwtAuthToken = jwt.sign(
      { email, password, username, _id },
      process.env.SecretNumber
    );
    return jwtAuthToken;
  }
  
  async function exitedUserFunc(email) {
    let exitedUser = await User.findOne({ email });
    let message;
    if (exitedUser) {
      message = 'Already Exited';
    } else {
      message = null;
    }
    return message;
  }
  
  async function passwordDcryptFunc(password , hashedPassword){
      let DcryptPassword = bcrypt.compare(password , hashedPassword)
      return DcryptPassword;
  }
  
  app.post('/register', async (req, res, next) => {
    let { email, username, password } = req.body;
    if(email != undefined && password !=undefined && username != undefined){
    let hashPassword = await passwordHashedFunc(password);
      if ((await exitedUserFunc(email)) != null) {
        res.json({message : "user already exited"})
      }else{
          try {
            let userData = new User({
              email: email,
              username: username,
              password: hashPassword,
            });
            let userDetails = await userData.save();
            if (userDetails) {
              let tokenDetails = new Token({
                token: await tokenGenerator(userDetails),
                userUid: userDetails._id,
              });
              let dataToken = await tokenDetails.save();
              res.json({ message: 'saved success', token : dataToken.token });
            }
          } catch (error) {
            res.json(error, 'error');
          }
      }
    }else{
      res.json({message : "Please Fill All Fields"})
    }
    
  });
  
  app.post('/login',async (req,res,next)=>{
      let {email , password} = req.body;
      try {
        if(email && password){
          let userFetchDetails = await User.findOne({email})
          if(userFetchDetails){
            let passwordResult = await passwordDcryptFunc(password,userFetchDetails.password)
          if(userFetchDetails.email === email && passwordResult === true){
              let tokenVal = await tokenGenerator(userFetchDetails)
              let tokenData = await Token.findOneAndUpdate({userUid : userFetchDetails._id},{token : tokenVal})
              res.json({token : tokenData.token})   
          }else{
              res.json({message : "Password is incorrect"})
          }
          }else{
            res.json({message : "Email Is Incorrect"})
          }
        }else{
          res.json({message : "fields Are Empty"})
        }
          
      } catch (error) {
          res.json(error , "error")
      }
  })


export default app;