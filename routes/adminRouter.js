
const express=require("express");
const adminRouter= express.Router();
const adminController=require("../controller/adminController");
const productController=require("../controller/productController");



// adminRouter.set("view engine","ejs");
// adminRouter.set("views","./views/admin");


//adminpage

adminRouter.get("/admin",adminController.Login);

adminRouter.post("/dashboard",adminController.verifyLogin);

adminRouter.get("/dashboard",adminController.dashboard);
adminRouter.get("/resetPass",adminController.resetPass);

adminRouter.get('/admin',adminController.logout);

adminRouter.get("adminLogin",adminController.adminForgot);
adminRouter.post("adminLogin",adminController.adminForgot);

adminRouter.get('/products',productController.product);

adminRouter.get('/users',productController.userpage);

// adminRouter.post("/products", upload.single("image"),productController.createProduct);



module.exports=adminRouter;