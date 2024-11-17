if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore= require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const { listingSchema,reviewSchema }= require("./schema.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"; //we can get this from mongoosejs.com site
// const Review=require("./models/review");

const dbUrl = process.env.ATLASDB_URL;

const listingRouter=require("./routes/listing.js"); //listing router
const reviewRouter=require("./routes/review.js");  //review router
const userRouter=require("./routes/user.js"); //userRoute

main()
    .then((res)=>{
        console.log("connected to db");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//for setting up ejs we write these two things
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
//this is for taking id value from path
app.use(express.urlencoded({extended : true}));
//this is for put req
app.use(methodOverride("_method"));
//for ejs mate
app.engine("ejs",ejsMate);
//for adding style to our boilerplate.ejs code
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error on MONGO SESSION STORE");
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
};

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull test");
// });

// app.get("/",(req,res)=>{
//     res.send("hlo bumbo");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next) => {
    let{statusCode=500,message="something went wrong!"}= err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(3000,()=>{
    console.log("app is listeining to port 3000");
});