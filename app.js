
if(process.env.NODE_ENV !="production"){

  require("dotenv").config();
}

// console.log(process.env.SECRET); 




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError=require("./ExpressError");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");

// require authentiction
const passport= require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const { listingSchema, reviewSchema } = require("./schema.js");
// routers
const reviewRouter = require("./routes/review.js"); // review in model app.js section but we can create new review.js in router js
const listingsRouter = require("./routes/listing.js");
const userRouter=require("./routes/user.js");



const { Http2ServerRequest } = require("http2");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

const dburl=process.env.ATLASDB_URL;


//connection for mongo with express
// call to main funcion
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

// connect database---main function
async function main() {
  await mongoose.connect(dburl);
  //pss data to this
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// method mongo-connect
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET_KEY
  },
  touchAfter: 24*3600,
  })


store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE", err)
});

//obj
const sessionOptions = {
  store,    // pass store
  secret:process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  Cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



// send response on server
app.get("/", (req, res) => {
  res.redirect("/listings");
  
});

app.use(session(sessionOptions));
app.use(flash());

//for authentication and authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());


app.use((req, res, next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();

});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);


// READ (show route of particular listing )
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params; // store pdata in id
  const listing = await Listing.findById(id); // find by iud data
  res.render("listings/show.ejs", { listing });
});


app.get("/admin", (req, res) => {
  throw new ExpressError(403, "access is forbidden");
});

// middleware for handling error
app.use((err, req, res, next) => {

  let { statusCode = 500, message = "something went wrong!" } = err;
  console.log(err)
  
});

// create server
app.listen(8080, (req, res) => {
  console.log("server is listening to port 8080");
});
