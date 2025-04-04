const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");



main().then(()=>{console.log("sucessfull")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const initDb = async ()=> {
     await Listing.deleteMany({});
      initData.data =  initData.data.map((obj)=>({...obj , owner:'67e6508ef1dc1bbf28075c4e'}));
     await Listing.insertMany(initData.data);
     console.log("data was initialised");
}

initDb();