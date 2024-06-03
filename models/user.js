const mongoose= require("mongoose");
const Schema=mongoose.Schema; //var define
const passportLocalMongoose= require("passport-local-mongoose"); // it will define automatically userrname and password 

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);