
const express=require("express");
const adminRouter= express.Router();
const adminController=require("../controller/adminController");
const productController=require("../controller/productController");
const categoryController=require("../controller/categoryController");
const adminAuth = require('../middleware/adminAuth');
const fs=require('fs')
const path =require('path');
const multer = require('multer');



//======================================photo uploading multer=====================================
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });


//================================admin side controller============================================

// adminRouter.get('/dashboard', adminController.createAdmin);
adminRouter.get("/admin",adminController.Login);
adminRouter.post("/dashboard",adminController.createAdmin);
adminRouter.get("/dashboard",adminAuth.isLogin,adminController.dashboard);
adminRouter.get('/admin',adminController.logout);
adminRouter.get("/forgotAdmin",adminController.adminForgot);
adminRouter.post("/resetpassAdmin",adminController.resetPass);
adminRouter.get('/users',adminController.userpage);
adminRouter.post('/adminUser',adminController.blockUser);
adminRouter.post('/adminUser',adminController.unblockUser);



//========================================product side controller========================================

adminRouter.get('/products',productController.product);
adminRouter.get('/addProduct',productController.productAdd);
adminRouter.post('/submit_product',upload.array("image"),productController.addProduct);


//==========================================catagory side controller======================================

adminRouter.get('/category',categoryController.category);
adminRouter.get('/addCategory',categoryController.categoryAdd);
adminRouter.post('/submit_category',categoryController.addCategory);
adminRouter.get('/categories/:id/edit', categoryController.getEditCategory);
adminRouter.post('/categories/:id/edit', categoryController.postEditCategory);
adminRouter.get('/categories/delete/:id', categoryController.postDeleteCategory);
adminRouter.put('/categories/:id/toggle', categoryController.toggleCategory);


//============================================================================================================
module.exports=adminRouter;