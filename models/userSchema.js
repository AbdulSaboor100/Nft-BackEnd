import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true 
    }
})

let User = mongoose.model("user" , userSchema);

export default User;