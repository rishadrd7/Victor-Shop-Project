
const express=require("express");
const session = require('express-session');
const config = require("../config/config");
const adminRouter= express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const adminController=require("../controller/adminController");
const productController=require("../controller/productController");
const categoryController=require("../controller/categoryController");
const orderController=require('../controller/orderController');
const offerController=require('../controller/offerController');
const couponController=require('../controller/couponController');
const walletController=require('../controller/walletController');
const adminAuth = require('../middleware/adminAuth');


adminRouter.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));
  


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
adminRouter.get("/login",adminController.Login);
adminRouter.post("/dashboard",adminController.createAdmin);
adminRouter.get("/dashboard",adminAuth.isLogin,adminController.dashboard);
adminRouter.get('/logout',adminController.logout);
adminRouter.get("/forgotAdmin",adminController.adminForgot);
adminRouter.post("/resetpassAdmin",adminController.resetPass);
adminRouter.get('/users',adminAuth.isLogin,adminController.userpage);
adminRouter.post('/adminUser',adminController.blockUser);
adminRouter.post('/adminUser',adminController.unblockUser);



//========================================product side controller========================================

adminRouter.get('/products',adminAuth.isLogin,productController.product);
adminRouter.get('/addProduct',adminAuth.isLogin,productController.productAdd);
adminRouter.post('/submit_product',upload.array("image"),productController.addProduct);
adminRouter.get('/editProduct/:productId', adminAuth.isLogin,productController.editProduct);
adminRouter.post('/products/:productId/edit',upload.array("image"), productController.updateProduct);
adminRouter.post('/products/:productId/toggle-status',productController.listUnlistProduct)




//==========================================catagory side controller======================================

adminRouter.get('/category',adminAuth.isLogin,categoryController.category);
adminRouter.get('/addCategory',adminAuth.isLogin,categoryController.categoryAdd);
adminRouter.post('/submit_category',categoryController.addCategory);
adminRouter.post('/update-category',categoryController.editCAtegory);
adminRouter.get('/categories/delete/:id', categoryController.postDeleteCategory);
adminRouter.patch('/list-unlist',categoryController.listUnlistCategory);



//============================================orders side controller=========================================

adminRouter.get('/orders', adminAuth.isLogin,orderController.ordersPage);
adminRouter.get('/orders/orderdetails/:orderId' ,adminAuth.isLogin,orderController.orderDetails);
adminRouter.post('/orders/updateOrderStatus' ,orderController.updateOrderStatus);

//============================================offer side controller=========================================
adminRouter.get('/offers',adminAuth.isLogin,offerController.offerPage);


//============================================coupon side controller=========================================
adminRouter.get('/coupons',adminAuth.isLogin,couponController.couponPage);



//============================================================================================================
module.exports=adminRouter;