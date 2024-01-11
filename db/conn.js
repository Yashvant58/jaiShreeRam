const mongoose =require('mongoose');
mongoose.set('strictQuery', false);
let DB=process.env.DATABASE;
const conn=async()=>{
try{
    await mongoose.connect(DB);
    console.log("mongodb connected...");
}catch(err){
    console.log(err);
}
}
conn();