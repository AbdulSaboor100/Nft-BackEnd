import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';
import passport from 'passport';
import Nft from '../models/NftSchema.js';

const app = express.Router();

dotenv.config();
  
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
  let {_id} = req.body;
  try {
    let result = await Nft.findOneAndUpdate({_id},{...req.body})
    if(result){
      res.json(result)
    }else{
      res.json({message : "please fill the nft _id and the field you wanna update "})
    }
  } catch (error) {
    res.json({error})
  }
})

app.post('/read-all-nfts', passport.authenticate("jwt",{session:false}),async (req , res , next)=>{
  try {
    let allNtfsResult = await Nft.find({});
    if(allNtfsResult){
      res.json({result : allNtfsResult})
    }else{
      res.json({message : "could not load nfts"})
    }
  } catch (error) {
    res.json({error})
  }
})

app.post('/read-user-nft', passport.authenticate("jwt",{session:false}),async (req , res , next)=>{
  let {_id} = req.user;
  try {
    let allNtfsResult = await Nft.find({user : _id});
    if(allNtfsResult){
      res.json({result : allNtfsResult})
    }else{
      res.json({message : "could not load nfts"})
    }
  } catch (error) {
    res.json({error})
  }
})

app.delete('/delete-user-nft', passport.authenticate("jwt",{session:false}) ,async (req,res,next)=>{
  let {_id} = req.body;
  try {
   let deleteNtfResult = await Nft.deleteOne({_id})
   if(deleteNtfResult.deletedCount > 0){ 
     res.json({message : "sucessfully deleted your nft"})
   }else{
     res.json({message : "can't getting user id"})
   }
  } catch (error) {
    res.json({error})
  }
})

export default app;