const { types, required } = require("joi");
const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type : String,
        required : true
    }
    // username and password is automativcally provided by passportLocalMongoose
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);