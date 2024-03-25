

const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            next(); // User is logged in, proceed to next middleware
        } else {
            res.redirect("/admin/login"); // User is not logged in, redirect to login page
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};



const isLogout = async (req, res, next) => {
    try {
        if (!req.session.admin_id) {
            next(); // User is logged out, proceed to next middleware
        } else {
            res.redirect("/dashboard"); // User is logged in, redirect to dashboard
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    isLogin,
    isLogout,
};
