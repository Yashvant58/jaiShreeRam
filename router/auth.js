const jwt=require("jsonwebtoken");
const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const User=require("../model/userSchema");
const authenticate=require("../middleware/authenticate");

router.post('/register',async(req,res)=>{
const {name,email,phone,work,password,cpassword}=req.body;
if(!name || !email || !phone || !work || !password || !cpassword){
    return res.status(422).json({error:"plz filled the field properly"});
}
try{
const userExist=await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"Email already Exist"});
        }else if(password != cpassword){
            return res.status(422).json({error:"password are not matched"});

        }else{
const user=new User({name,email,phone,work,password,cpassword})
        await user.save();
        res.status(201).send("registration sucessfully");
        }
}catch(err){
    console.log(err);
};
})
router.post("/signin",async(req,res)=>{
  
const {email,password}=req.body;
try{
    
    if(!password || !email){
        return res.status(400).json({error:"plz filled the field properly"});
    }
    const userExist=await User.findOne({email:email});
    if(userExist){

    const isMatch=await bcrypt.compare(password,userExist.password)
    
   let token=await userExist.generateAuthToken();
   res.cookie("jwt",token,{
    expires:new Date(Date.now()+25892000000000)
    ,httpOnly:true
}
);
    if(!isMatch){
        res.status(400).json({error:"Invalid Credientials*"});
    }else{
        res.status(200).json({massage:"user Signin Successfully"});
    }
}else{
    res.status(400).json({error:"Invalid Credientials*"});
}
}catch(err){
    console.log(err);
}
router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/blog',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/cart',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/contact',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/home',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/shop',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get('/review',authenticate,(req,res)=>{
    res.send(req.rootUser);
})

router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.post('/getcontact',authenticate,async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body;
console.log(req.body);
if( !name || !email || !phone || !message){
    return res.json({error:"plzz filled the contact form"});
}



const userContact =await User.findOne({_id:req.userId});
console.log(userContact);
if(userContact){
    const userMessage=await userContact.addingMessage({name,email,phone,message});

    await userContact.save();
    return res.status(201).json({message:"user contact successfully"})
}

    }catch(error){
        console.log(error);
    }
    
})
router.get('/logout',authenticate,(req,res)=>{
    res.clearCookie('jwt',{path:'/'})
    res.status(200).send('user logout');
})

})

module.exports=router;