module.exports.isAdmin=(req,res,next)=>{
    if(!res.locals.currentUser || res.locals.currentUser.role!=="admin"){
        req.flash("error","Only Admin do this");
        return res.redirect("/hackathon/all");
    }
    next();
}

module.exports.isStudent=(req,res,next)=>{
    if(!res.locals.currentUser || res.locals.currentUser.role!=="student"){
        req.flash("error","Only Student do this");
        return res.redirect("/hackathon/all");
    }
    next();
}