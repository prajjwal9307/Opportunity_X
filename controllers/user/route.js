const User = require("../../models/User/user.js");


module.exports.signup_get =(req, res) => {
    res.render("Auth/sign");
};


module.exports.signup_post = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);

        // Auto-login after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome ${username}!`);
            res.redirect("/home");   // redirect like normal login
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.login_get=(req, res) => {
    res.render("Auth/login");
}
module.exports.login_post=async (req, res) => {
    req.flash("success", `Welcome ${req.user.username}`);
    let redirectUrl = res.locals.redirectUrl || "/home";
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        res.redirect("/home");
    })

}