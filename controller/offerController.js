
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const ObjectId = mongoose.Types.ObjectId 


//set up offer page
const offerPage = async (req,res)=>{
    try {
        const offers = await Offer.find().sort({_id :-1})
        // console.log(offers);
        res.render('admin/offers' , {offers})
    } catch (error) {
        console.log(error);
        
    }
}


//setup add offer page
const addOfferPage = async(req,res)=>{
    try {
        const products = await Product.find({});
        const categories = await Category.find({});
        // console.log(products ,"next", categories);

        res.render('admin/addOffer' ,{products , categories});
    } catch (error) {
        console.log(error);
        
    }
}

//show categories in add offer
const categoryOffer=async (req,res)=>{
    try {
        const categories = await Category.find({});
        res.json({categories});
    } catch (error) {
        console.log(error.message);
    }
}

//show products in add offer
const productOffer=async (req,res)=>{
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log(error.message);
    }
}


//offer adding to items
const offerAdding=async(req,res)=>{
    try {
        const {offerTitle,offerPercentage,description,startDate,expireDate,selectedItems}=req.body

        // console.log(offerPercentage,'offer percenteage');
        // console.log(startDate,'start date in offer adidng ');
        // console.log(expireDate,'expire date in offer adding ');
        // console.log(selectedItems,'selected items in controler')
        
        for (const itemId of selectedItems) {
            let offerApplied = 0;

            const product = await Product.findById(itemId);
            if (product) {
                offerApplied = offerPercentage;
                product.offerApplied = offerApplied;
                await product.save();
            } else {
                const category = await Category.findById(itemId);
                if (category) {
                    offerApplied = offerPercentage;
                    category.offerApplied = offerApplied;
                    await category.save();
                }
            }
        }

        const newOffer=new Offer({
            title:offerTitle,
            discountPercentage:offerPercentage,
            description,
            startDate,
            expireDate,
            selectedItems
            
        })
        await newOffer.save()
        res.redirect('/admin/offers') 
        res.status(200).json({ message: 'Offer created successfully' });


    } catch (error) {
        console.log(error.message);
    }
}


//Edit offer page
const editOffers = async (req,res)=>{
    try {
        const {offerId} =req.params
        const offer = await Offer.findById(offerId);
        console.log(offerId , offer);
        res.render("admin/editOffer" ,{offer})
    } catch (error) {
        console.log(error);
        
    }
}


const editOfferPost = async(req,res)=>{
    try {
        const{id}=req.params
        const{offerTitle,offerPercentage,description,startDate,expireDate}=req.body

        console.log(id);
        const updateOffer = await Offer.findByIdAndUpdate(id,{
            title:offerTitle,
            discountPercentage:offerPercentage,
            description,
            startDate,
            expireDate
        },
        {upsert:true}
        )
        updateOffer.save()
        res.redirect('/admin/offers')
    } catch (error) {
        console.log(error);
        
    }
}

//delete offers
const deleteOffer = async(req,res)=>{
    try {
        console.log("offer deleted");
        const {offerId} = req.params
        console.log(offerId);
        await Offer.findByIdAndDelete(offerId);
        res.json({success:true})
        res.redirect('/admin/offers');
    } catch (error) {
        console.log(error);
        
    }
}


module.exports={
    offerPage,
    addOfferPage,
    categoryOffer,
    productOffer,
    offerAdding,
    editOffers,
    editOfferPost,
    deleteOffer
}