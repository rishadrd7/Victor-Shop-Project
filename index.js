
const dotenv = require("dotenv").config()

const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Victor");


const express=require("express");
const app=express();
const path=require("path");
const userRoutes=require("./routes/userRouter");
const adminRoute=require("./routes/adminRouter");

//express-session
const flash = require('express-flash')
app.use(flash())

const session = require('express-session');

app.use(session({
    secret:"hfgx",
    resave:true,
    saveUninitialized:false,

}))

//facebookLogin

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));
  


//googlelogin
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET
}))

    
app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/',userRoutes);
app.use('/admin',adminRoute);



//for user route
app.get("/",(req,res)=>{
    res.render("users/homepage")
})


// //for admin route
app.get("/admin",(req,res)=>{
    res.render("admin/adminLogin")
});



app.listen(7070,()=>{
    console.log("http://localhost:7070");
})