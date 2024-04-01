
const mongoose = require('mongoose') 
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const ObjectId = mongoose.Types.ObjectId 


//set up coupon page
const couponPage = async (req,res)=>{
    try {
        const coupons =  await Coupon.find({})
        res.render('admin/coupons', {coupons})
    } catch (error) {
        console.log(error);
        
    }
}

//add coupon page
const addCouponPage  = async (req,res)=>{
    try {
        res.render('admin/addCoupon')
    } catch (error) {
        console.log(error);
        
    }
}


//coupon add post
const addCoupon = async (req,res)=>{
    try {
        console.log("coupon added");
        const {couponName,couponCode,description,discount,expireDate}=req.body
            console.log(couponCode,'couponcode ');
            console.log(expireDate,'expiredate');
            console.log(description,'description in coupon add');

        const newCoupon= new Coupon({
            name:couponName,
            code:couponCode,
            description,
            discountAmount:discount,
            expireDate
        })

        const savedCoupon = await newCoupon.save()
        res.redirect('/admin/coupons')

    } catch (error) {
        console.log(error);
        
    }
}



const deleteCoupon = async (req,res)=>{
    try {
        console.log("coupon deleted");
        const {couponId}=req.params
        console.log(couponId);
        await Coupon.findByIdAndDelete(couponId);
        res.json({success:true})
    } catch (error) {
        console.log(error);
        
    }
}

//set up edit coupon page
const editCouponPage = async (req,res)=>{
    try {
        console.log("edit coupon");
        const {couponId}=req.params
        console.log(couponId);
        const coupon = await Coupon.findById(couponId)
        res.render('admin/editCoupon' ,{coupon});
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while fetching coupon details.");
    }
}


const editedCoupon = async(req,res)=>{
    try {
        const {couponId}=req.params
        const {couponName, couponCode , description ,discount , expireDate}=req.body;

        const editCoupon = await Coupon.findOneAndUpdate(
            { _id: couponId }, // Use object syntax to specify the query
            {
                name: couponName,
                code: couponCode,
                description,
                discountAmount: discount,
                expireDate
            },
            { new: true }
        );

        if (!editCoupon) {
            return res.status(404).send("Coupon not found");
        }

        res.redirect('/admin/coupons');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while updating coupon.");
    }
}

module.exports={
    couponPage,
    addCouponPage,
    addCoupon,
    deleteCoupon,
    editCouponPage,
    editedCoupon
}