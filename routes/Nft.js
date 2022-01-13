import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';
import passport from 'passport';
import Nft from '../models/NftSchema.js';

const app = express.Router();

dotenv.config();

// // Cloudinary and Multer setup start
// var storage = multer.diskStorage({
//     filename: function (req, file, callback) {
//       callback(null, Date.now() + file.originalname);
//     },
//   });
//   var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|svg|png|gif)$/i)) {
//       return cb(new Error("Only image files are allowed!"), false);
//     }
//     cb(null, true);
//   };
  
//   cloudinary.config({
//     cloud_name: process.env.cloudinary.cloudName,
//     api_key: process.env.cloudinary.apiKey,
//     api_secret: process.env.cloudinary.secretKey,
//   });
//   var upload = multer({ storage: storage, fileFilter: imageFilter });

  
  app.post('/create-nft',passport.authenticate("jwt", { session: false }),async(req,res)=>{
    let {title , description , image} = req.body;
    try {
        if(title != undefined && description != undefined && image != undefined){
            let nftModel = new Nft({
                title : title ,
                description : description,
                image : image,
                user : req.user._id
            })
            let ntfSavedResult = await nftModel.save();
            if(ntfSavedResult){
              res.json({message : "saved successfully"})
            }
        }else{
            res.json({message : "Fields Empty"})
        }
    } catch (error) {
        res.json(error)
    }
})

app.put('/update-nft',passport.authenticate("jwt", { session: false }),async (req,res,next)=>{
  let {_id} = req.user;
  try {
    let result = await Nft.findOneAndUpdate({user:_id},{...req.body})
    res.json(result)
  } catch (error) {
    res.json({error})
  }

})

export default app;