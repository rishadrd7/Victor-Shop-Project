

const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Victor");
require('dotenv').config();


const express=require("express");
const session = require("express-session");
const app=express();
const path=require("path");
const userRoutes=require("./routes/userRouter");
const adminRoute=require("./routes/adminRouter");
const passport= require("passport");
const nocache = require('nocache');
const flash=require('express-flash');


app.use(nocache());
app.use(flash())


app.use(session({
  secret:"secretsesion",
  resave:false,
  saveUninitialized:true
}))



//google
app.use(session({
  resave:false,
  saveUninitialized: true,
  secret: 'SECRET'
  
}));


//facebook
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

 
app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/',userRoutes);
app.use('/admin',adminRoute);



//====================================for user route=====================================================
app.get("/",(req,res)=>{
    res.render("users/homepage")
})


//=====================================for admin route======================================================
app.get("/admin",(req,res)=>{
    res.render("admin/adminLogin")
});



app.listen(3000,()=>{
    console.log("http://localhost:3000");
})