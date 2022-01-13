import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userAuth from './routes/userAuth.js';
import Nft from './routes/Nft.js';
import passport from 'passport';
import passport2 from './configs/passport.js';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();
let port = process.env.PORT;
app.use(bodyParser.json({limit :"2mb"}))
//Connection
mongoose.connect(process.env.MONGODBKEY);
mongoose.connection.once('open', () => {
  console.log('database connected');
});
//Connection
app.use(passport.initialize());
passport2(passport)
// require("./configs/passport")(passport);



app.use('/api/user/auth',userAuth);
app.use('/api/user/nft' ,Nft)

app.listen(5000, () => {
  console.log('server is running');
});
