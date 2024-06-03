const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

// constrollers of mvc(model,views, controllers)
const listingController=require("../controllers/listings.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

// CRUD operation

//COMPACT router.route====common path 

//for index and create 
router
.route("/")
.get( wrapAsync(listingController.index))// index route
.post( isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));//create route ---> 




//  [  new Route ]
router.get("/new",isLoggedIn, listingController.renderNewForm);



// for show and update and delete
router.route("/:id")
.get(wrapAsync(listingController.showList))
.put(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));




// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
