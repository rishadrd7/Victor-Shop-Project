// const isLogin = async (req, res, next) => {
//     try {
//         if (req.session.user_id) {
//            next()
//         } else {
//             res.redirect('/home')       
//         }
//     } catch (error) {
//        res.render('500')
//     }
// };


// const isLogout = async (req, res, next) => {
//     try {
//         if (req.session.user_id) {
//             res.redirect('/home');
//         } else {
//             next();
//         }
//     } catch (error) {
//         res.render('500')
//     }
//   }

// module.exports = {
//     isLogin,
//     isLogout
// };
