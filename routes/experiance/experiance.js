const express = require('express');
const router = express.Router();
// const mongoose = require("mongoose");


// const InterviewExperience = require("../../models/expsharing.js");
const wrapAsync = require('../../utils/asyncWrapper.js');
// const { interviewExperienceSchema } = require('../../schema.js');
// const ExpressError = require('../../utils/ExpressError.js');
// const Comment = require("../../models/comments.js");
const { isLoggedIn } = require("../../middleware/auth.js");

const experiance=require("../../controllers/experiance/route.js")

router.get("/add", isLoggedIn, experiance.addlisting_get)

router.post("/add", isLoggedIn, wrapAsync(experiance.addlisting_post));

// Show All Experiance *
router.get("/all", isLoggedIn, wrapAsync(experiance.alllisting));

// Show Details Experiance *
router.get("/:id", isLoggedIn, wrapAsync(experiance.detailslisting));

// Upvote *
router.get("/:id/upvotes", isLoggedIn, wrapAsync(experiance.upvote));

// comment *
router.post("/:id/comment", isLoggedIn, wrapAsync(experiance.comment));

// Delete Experiance *
router.get("/:id/delete", isLoggedIn, wrapAsync(experiance.destroyexperiance));

// Delete Comment *
router.get("/:id/:commentid/delete", isLoggedIn, wrapAsync(experiance.destroycomment));

module.exports = router;