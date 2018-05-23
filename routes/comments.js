var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ==========================
// COMMENTS ROUTES
// ==========================

router.get("/new", middleware.isLoggedIn, (req,res) => {
    // Find campground from DB
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

router.post("/", (req, res) => {
    
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           //create new comment
           Comment.create(req.body.comment, (err, comment) => {
               if(err) {
                   req.flash("error", "Something went wrong!");
                   console.log(err);
               } else {
                   //add username and id to comment
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id
                   //save comment
                   comment.save();
                   console.log(comment);
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    req.flash("success", "Comment");
                    res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
       if(err) {
            res.redirect("/campgrounds/" + req.params.id);
       } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
       }
    });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedCampground) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment delted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;