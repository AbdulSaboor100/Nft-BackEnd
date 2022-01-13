import mongoose from 'mongoose';

let tokenSchema = mongoose.Schema({
    token : {
        type : String,
        required : true,
        unique : true
    },
    userUid : {
        type : String,
        required : true,
        unique : true
    }
})

let Token = mongoose.model('token' , tokenSchema);

export default Token;