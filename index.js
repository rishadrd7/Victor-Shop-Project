const mongoose=require("mongoose");
const express=require("express");
const session = require("express-session");
const passport= require("passport");
const nocache = require('nocache');
const flash = require('express-flash');
const path=require("path");
require('dotenv').config();


//create express app
const app=express();

//connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Victor");


//set up flach and nocache
app.use(nocache());
app.use(flash())


//set up session middleware
app.use(session({
  secret:"secretsession",
  resave:false,
  saveUninitialized:true
}))

// set up google session
app.use(session({
  resave:false,
  saveUninitialized: true,
  secret: 'SECRET'
  
}));

//set up facebook session
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

 //set up view engine
app.set("view engine","ejs");


app.use(express.json());
app.use(express.urlencoded({extended:true}));

//set up file path
app.use(express.static(path.join(__dirname, 'public')))


//load routs
const userRoutes=require("./routes/userRouter");
const adminRoute=require("./routes/adminRouter");

//set up routes
app.use('/',userRoutes);
app.use('/admin',adminRoute);



//====================================for user routes=======================================================
app.get("/",(req,res)=>{
    res.render("users/homepage")
})


//=====================================for admin routes======================================================
// app.get("/admin/login",(req,res)=>{
//   res.render("admin/adminLogin")
// });

//============================================PORT=============================================================

app.listen(3000,()=>{
    console.log("http://localhost:3000");
})