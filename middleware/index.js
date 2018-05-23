var Campground = require("../models/campground");
var Comment = require("../models/comment");
//ALL THE MIDDLEWARE GOES HERE!
var middlewareObj = {}

//middleware to handle user authorisation
middlewareObj.checkCampgroundOwnership = function (req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash("error", "Campground not found");
                console.log(err);
            } else {
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                //otherwise redirect
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    //if not redirect
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


//middleware to handle user authorisation
middlewareObj.checkCommentOwnership = function (req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                req.flash("error", "Campground not found");
                console.log(err);
            } else {
                //does user own the campground?
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                //otherwise redirect
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    //if not redirect
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//middleware checking if user is still logged in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;