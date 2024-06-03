// this is for when wanna do chnge data remove old data
require("dotenv").config();

const mongoose = require("mongoose");
const initData=require("./data.js");

const Listing= require("../models/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { query } = require("express");
const mapToken=process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient=mbxGeocoding({accessToken : mapToken});


//connection for mongo with express
// call to main funcion
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);

});

// connect database---main function
async function main(){
    await mongoose.connect(mongo_url);

}


// function initialize database

const initDB= async()=>{

    // if already have datat and want to clean so...collection.deleteMany()
    await Listing.deleteMany({});


    let i=0;

    for(let listing of initData.data){
        let response=await geocodingClient.forwardGeocode({
            query:listing.location,
            limit:1 
        })
        .send();

        listing.geometry=response.body.features[0].geometry;
        initData.data[i++]=listing;

    }

    initData.data= initData.data.map((obj)=>({...obj,
        owner:"6655b577830ed291fe149cd4",
    }));

    // insert new data
    await Listing.insertMany(initData.data);
    console.log("data was initialize");

}
// call initDb function

initDB();
