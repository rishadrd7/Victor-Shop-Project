const User = require("../models/userModel");
const Order = require('../models/ordersModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const Wallet = require('../models/walletModel');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
require('dotenv').config();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const ExcelJS = require('exceljs');



//setup admin login page

const Login = async (req, res) => {
    try {
        console.log("admin login");
        const msg = req.flash("message");

        // If session already exists, redirect user to dashboard
        if (req.session.admin_id) {
            return res.redirect("/admin/dashboard");
        }

        res.render("admin/adminLogin", { msg });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};



//adminDetails
const createAdmin = async (req, res) => {
    try {

        const bodyEmail = req.body.email
        const bodyPass = req.body.password

        const adminData = await User.findOne({ email: bodyEmail, is_admin: true });
        console.log(adminData, "admin Logged");

        if (adminData) {

            const matchPas = await bcrypt.compare(bodyPass, adminData.password)

            if (matchPas) {
                req.session.admin_id = adminData._id

                res.redirect('/admin/dashboard')

            } else {
                res.render('admin/adminLogin', { msg: "Incorrect Password" })
            }

        } else {
            res.render("admin/adminLogin", { msg: "Email and Password Incorrect" })

        }

    } catch (error) {
        console.error(error);

    }
};





//logout
const logout = async (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Internal Server Error");
            }
            // Redirect the user to the admin login page
            res.redirect('/admin/login');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};


//forgotpass
const adminForgot = async (req, res) => {
    try {
        res.render("admin/forgotAdmin");
    } catch (error) {
        console.log(error);
    }
}

//resetpass

const resetPass = async (req, res) => {
    try {
        res.render("admin/resetpassAdmin");
    } catch (error) {
        console.log(error);
    }
}





// set usersPage
const userpage = async (req, res) => {
    try {
        const users = await User.find({ is_admin: false });
        // console.log(users,'users in dashboars'); 
        res.render('admin/adminUser', { users: users, formatDate: formatDate })
    } catch (error) {
        console.log(error);

    }
}

//date formate user join
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US');
    return formattedDate;
};



//admin user block and unblock
const blockUser = async (req, res) => {
    try {
        const userId = req.body.usersId
        const blockedUser = await User.findOne({ _id: userId })
        blockedUser.is_blocked = !blockedUser.is_blocked;
        const g = await blockedUser.save()
        res.send({ g })

    } catch (error) {
        console.log(error);
        res.status("500").render('500')
    }
}


const unblockUser = async (req, res) => {
    try {
        console.log("helo");
        const userId = req.body.userId;
        console.log(userId);
        const unblockedUser = await User.findOne({ _id: userId }, { is_blocked: false }, { new: true });
        res.send(unblockedUser);
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}


//set up salesreport
const loadReport = async (req, res) => {
    try {
        console.log('sales report')
        const order = await Order.find()
        res.render('admin/salesReport', { order });
    } catch (error) {
        console.log(error);

    }
}


const showReport = async (req, res) => {
    try {
        console.log('Report listing');
        const { reportType, startDate, endDate } = req.body;
        console.log(reportType, 'next', startDate, 'next', endDate, 'next');
        let query = {};


        switch (reportType) {
            case 'daily':
                query = {
                    orderDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                };
                break;
            case 'weekly':
                query = {
                    orderDate: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                        $lt: new Date()
                    }
                };
                break;
            case 'monthly':
                query = {
                    orderDate: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date()
                    }
                };
                break;
            case 'yearly':
                query = {
                    orderDate: {
                        $gte: new Date(new Date().getFullYear(), 0, 1),
                        $lt: new Date()
                    }
                };
                break;
            case 'custom':
                query = {
                    orderDate: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                };
                break;
            default:
                break;
        }
        const orders = await Order.find(query);
        console.log('orders in sales report ');
        // const reportData = orders.map(order => ({
        //     date: order.orderDate ? order.orderDate.toISOString().split('T')[0] : 'N/A',
        //     salesCount: orders.length,
        //     revenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),
        //     // coupon: order.couponApplied 
        // }));

        const reportData = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: '$orderDate' } },
                    salesCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }

                }
            },
            { $sort: { _id: 1 } }
        ])
        const formattedReportData = reportData.map(item => ({
            date: item._id,
            salesCount: item.salesCount,
            revenue: item.revenue
        }))
        orders.forEach(order => {
            console.log(order._id, order.orderDate, 'order.orderDate');
        })
        console.log(reportData, 'dhssssssssssssssssssssssssssssssss');
        console.log(formattedReportData, 'formmmmmmmmmmmmmmmmmmmmmmmmmmm');


        if (req.query.format === 'pdf') {
            const doc = new PDFDocument();
            const filename = `sales_report_${reportType}.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            doc.pipe(res);
        
            doc.fontSize(12).text(`Report Type: ${reportType}`, { align: 'center' });
            doc.moveDown();
        
            doc.fontSize(16).text('Sales Report', { align: 'center' });
            doc.moveDown();
        
            const tableHeader = ['Date', 'Sales Count', 'Revenue'];
            let xPos = 50;
            let yPos = doc.y + 50;
        
            tableHeader.forEach(header => {
                doc.text(header, xPos, yPos, { width: 150, align: 'left' });
                xPos += 200;
            });
        
            yPos += 25;
            formattedReportData.forEach(item => {
                xPos = 50;
                doc.text(item.date.toString(), xPos, yPos, { width: 150, align: 'left' });
                xPos += 200;
                doc.text(item.salesCount.toString(), xPos, yPos, { width: 150, align: 'left' });
                xPos += 200;
                doc.text(item.revenue.toString(), xPos, yPos, { width: 150, align: 'left' });
                yPos += 25;
            });
        
            doc.end();
        } else if (req.query.format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Report');
        
            worksheet.addRow(['Date', 'Sales Count', 'Revenue']);
        
            formattedReportData.forEach(item => {
                worksheet.addRow([item.date.toString(), item.salesCount, item.revenue]);
            });
        
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');
        
            await workbook.xlsx.write(res);
            res.end();
        }
        
        
        else {
            // Respond with JSON data
            res.json(formattedReportData);
        }

    } catch (error) {
        console.error(error);
    }
}


//dashboard
const dashboard = async (req, res) => {
    try {

        const { top10Products, top10Categories } = await top10ProductsCategories(req, res)
        const order = await Order.find()
        let revenue = order.reduce((total, order) => total + order.totalAmount, 0);
        let salesCount = order.length
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        let nextDay = new Date(currentDate)
        nextDay.setDate(currentDate.getDate() + 1)
        let dailyOrder = await Order.find({
            orderDate: {
                $gte: currentDate,
                $lte: nextDay
            }
        })
        let dailyRevenue = dailyOrder.reduce((total, order) => total + order.totalAmount, 0)
        res.render("admin/dashboard" , { order, revenue, salesCount, dailyRevenue, top10Products, top10Categories});
    } catch (error) {
        console.log(error);
    }
}


const top10ProductsCategories = async (req, res) => {
    try {
        const top10Products = await Order.aggregate([
            {
                $match: {
                    'status': 'Delivered'
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    'from': 'products',
                    'localField': 'products.productId',
                    'foreignField': '_id',
                    'as': 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $group: {
                    '_id': '$productDetails._id',
                    'name': { '$first': '$productDetails.name' },
                    'image': { '$first': '$productDetails.image' },
                    'count': { '$sum': '$products.quantity' }
                }
            },
            {
                $sort: { 'count': -1 }
            },
            {
                $limit: 10
            }
        ]);

        const top10Categories = await Order.aggregate([
            {
                $match: {
                    'status': 'Delivered'
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    'from': 'products',
                    'localField': 'products.productId',
                    'foreignField': '_id',
                    'as': 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $group: {
                    '_id': '$productDetails.category',

                    'count': { '$sum': 1 }
                }
            },
            {
                $lookup: {
                    'from': 'categories',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'categoryDetails'
                }
            },
            {
                $unwind: '$categoryDetails'
            },
            {
                $project: {
                    _id: 0,
                    categoryName: '$categoryDetails.name',
                    count: 1
                }
            },
            {
                $sort: { 'count': -1 }
            },
            {
                $limit: 10
            }
        ]);
        console.log(top10Products, 'top10 products ');
        console.log(top10Categories, 'top 10 categories ');


        return { top10Products, top10Categories }

    } catch (error) {
        console.error('Error founded in top10Products and categories', error);
    }
}



module.exports = {
    createAdmin,
    Login,
    dashboard,
    adminForgot,
    resetPass,
    logout,
    userpage,
    blockUser,
    unblockUser,
    loadReport,
    showReport,

}