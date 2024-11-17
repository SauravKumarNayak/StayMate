const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"; //we can get this from mongoosejs.com site

main()
    .then((res)=>{
        console.log("connected to db");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//here i have made a function where pehle se koi bhu document entered hai toh delete kar do 
//and phir jo data sab hai usko insert kar do
const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67249c718b4b0228ae3b03e0"}));
    //in insertMany we pass array of objects
    await Listing.insertMany(initData.data); //initData is a object where data is value i.e array of objects
    console.log("data was initialized");
};

initDB();