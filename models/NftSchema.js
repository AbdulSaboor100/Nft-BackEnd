import mongoose from 'mongoose';

let nftSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

let Nft = mongoose.model('Nft' , nftSchema);

export default Nft;