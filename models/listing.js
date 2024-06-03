const mongoose = require("mongoose");
const Schema = mongoose.Schema; //var define
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
    // schema
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {

        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1716377239833-54b55d732bc8?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1716377239833-54b55d732bc8?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        },
        filename: String,

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true

        },

        coordinates: {
            type: [Number],
            required: true,
        },
    },


    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","deserts"]
    // }

    
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })

    }
})



//create model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
