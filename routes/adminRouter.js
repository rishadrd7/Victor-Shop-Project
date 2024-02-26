
const express=require("express");
const adminRouter= express.Router();
const adminController=require("../controller/adminController");



// adminRouter.set("view engine","ejs");
// adminRouter.set("views","./views/admin");




//adminpage

adminRouter.get("/admin",adminController.Login);
adminRouter.get("/dashboard",adminController.dashboard);
adminRouter.get("/resetPass",adminController.resetPass);

adminRouter.get("adminLogin",adminController.adminForgot);
adminRouter.post("adminLogin",adminController.adminForgot);


module.exports=adminRouter;