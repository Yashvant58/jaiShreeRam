const dotenv=require("dotenv");
const express = require('express');
dotenv.config({path:'./config.env'})
require("./db/conn");
const { handleError } = require('./utils/errorHandler');
const userRoutes = require('./routes/userRoutes');
const category=require('./routes/categroyRoutes')
const banner =require('./routes/bannerRouter')
const admin =require('./routes/adminRouter')
const cityRoutes=require("./routes/cityRouter")
const app = express();
const path=require('path');
const PORT=process.env.PORT;



// Middleware to parse incoming requests with JSON payloads
app.use(express.json()); // For parsing application/json

// If you're working with forms (optional, for parsing application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
//Admin routes
app.use('/admin',admin);


app.use('/cityRoute', cityRoutes);
// User routes

app.use('/users', userRoutes);
app.use('/category',category)
app.use('/banner',banner)
app.use(handleError);

app.get("/check", (req, res) => res.send({ msg: "E-commerse is working fine" }));
app.get("/hello", (req, res) => res.send({ msg: "Welcome to E-commerse backend" }));
app.listen(PORT,()=>{
console.log(`server is running at port no ${PORT}`);
})



