const express=require("express");
const router=express.Router();

const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const { listingSchema}= require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer = require("multer");

const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

// const validateListing = (req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         throw new ExpressError(400,error);
//     }else{
//        next(); 
//     }
// }


// //index route
// router.get("/", 
//     wrapAsync(listingController.index)
// );
// //create root
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);    

// //update route
// router.put("/:id", 
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)  
// );

// //delete route
// router.delete("/:id",
//     isLoggedIn, 
//     wrapAsync(listingController.destroyListing)    
// );

// //show route
// router.get("/:id",
//     wrapAsync(listingController.showListing)    
// );    
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( 
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)  
    )
    .delete(
        isLoggedIn, 
        wrapAsync(listingController.destroyListing)    
    );


//edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;