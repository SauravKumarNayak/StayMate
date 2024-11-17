const Listing=require("../models/listing");

module.exports.index =async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing already deleted!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // const newListing= new Listing({
    //     title:title,
    //     description:description,
    //     image : image,
    //     price: price,
    //     location: location,
    //     country: country
    // });
    // it can be written as below also:-
    //here we are basically in new.ejs we have made an obj listing that contains all key 
    //req.body has a listing object witch all key val pair
    //we will pass that listings to listing and make a new document
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listings");
        // }
        // let result = listingSchema.validate(req.body);
        // if(result.error){
        //     throw new ExpressError(400, result.error);
        // }
        let url=req.file.path;
        let filename=req.file.filename;
        
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url, filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res) => {
    let {id} = req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    //if body listing gives error then if condition will work.
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listings");
    // }
    let {id} = req.params;
    // let listing=await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","you dont have permissions to edit it");
    //     return res.redirect("/listings");
    // }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    
    req.flash("success","Review Updated!");
    res.redirect("/listings"); //res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}