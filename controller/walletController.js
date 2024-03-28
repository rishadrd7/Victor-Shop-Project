const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const Wallet = require('../models/walletModel');
const ObjectId = mongoose.Types.ObjectId 


//set up wallet page
const walletpage = async (req, res) => {
    try {
        // Fetch user data
        const userData = await User.findOne({ _id: req.session.user });
        if (!userData) {
            return res.status(404).send('User not found');
        }

        // Fetch wallet data for the user
        const wallet = await Wallet.findOne({ userId: req.session.user }).populate('transactions');
        if (!wallet) {
            // If the wallet doesn't exist, initialize it with a default balance and transactions
            const newWallet = new Wallet({
                userId: req.session.user,
                balance: 0, // Default balance
                transactions: [] // No transactions initially
            });
            await newWallet.save();
            return res.render('pages/wallet', { userData, walletBalance: newWallet.balance, transactions: newWallet.transactions });
        }

        // If the wallet exists, render the page with the wallet balance and transactions
        res.render('pages/wallet', { userData, walletBalance: wallet.balance, transactions: wallet.transactions });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};



const addMoney = async (req, res) => {
    try {
        console.log("amount added");
        const amount = parseFloat(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        console.log(amount, "Added");

        const wallet = await Wallet.findOne({ userId: req.session.user });
        if (!wallet) {
            // If the wallet doesn't exist, create a new one
            const newWallet = new Wallet({
                userId: req.session.user,
                balance: amount,
                transactions: [{
                    type: 'credit',
                    reason: 'added money to wallet',
                    transactionAmount: amount
                }]
            });
            await newWallet.save();
            return res.json({ message: 'Money added successfully', newBalance: amount });
        }

        // If the wallet exists, update the balance and add a transaction
        wallet.balance += amount;
        wallet.transactions.push({
            type: 'credit',
            reason: 'added money to wallet',
            transactionAmount: amount
        });
        await wallet.save();
        
        res.json({ message: 'Money added successfully', newBalance: wallet.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding money to the wallet' });
    }
};



const processWalletPayment=async(req,res)=>{
    try {
        console.log("aaaaaa");
        const {totalAmount}=req.body
        console.log(totalAmount,'totalamount processWallet payment');
        const userId=req.session.user
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = new Wallet({
                userId,
                balance: 0,
                transactions: []
            });
        }

        wallet.balance -= totalAmount;
        wallet.transactions.push({
            type: 'debit',
            reason: 'purchased product',
            date: new Date(),
            transactionAmount: totalAmount
        });

        await wallet.save()

        res.status(200).send('Payment processed successfully');
    } catch (error) {
        console.log(error.message);
    }
}


const processRefund=async(req,res)=>{
    try {
        console.log("aaaaaaaa");
        const {orderId,totalAmount }=req.body
        const order= await Order.findOne({_id:orderId})
        console.log(order,'aa');
        let refundAmount=order.totalAmount
        
        console.log(orderId,'order id in process refund ');
        console.log(refundAmount,'refundAmount in process refund amount');
        const userId=req.session.user_id
        let wallet =await Wallet.findOne({userId})

        if(!wallet){
            return res.redirect('/home')
        }
        wallet.balance+=refundAmount 
        wallet.transactions.push({
            type:"credit",
            reason:'refund',
            date:new Date(),
            transactionAmount:refundAmount
        })
        await wallet.save()
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    walletpage,
    addMoney,
    processRefund,
    processWalletPayment
}