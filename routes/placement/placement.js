const express=require('express');
const router=express.Router();
const multer=require("multer")
const {storage}=require("../../cloudConfig.js")
const upload=multer({storage,limits:{ fileSize: 500 * 1024 }});

const wrapAsync = require('../../utils/asyncWrapper.js');
const {isLoggedIn}=require("../../middleware/auth.js");
const {isAdmin,isStudent}=require("../../middleware/placement.js")
const placementRoute=require("../../controllers/placement/route.js")

// add Placement Company Admin
router.get("/listing",isLoggedIn,isAdmin,placementRoute.listingcompany_get)

router.post("/listing",isLoggedIn,isAdmin, wrapAsync(placementRoute.listingcompany_post))

// Both
router.get("/",isLoggedIn, wrapAsync(placementRoute.alllistingcompany));

router.get("/:id",isLoggedIn, wrapAsync(placementRoute.detailslisting));

// Admin
router.delete("/:id",isLoggedIn,isAdmin, wrapAsync(placementRoute.destroylisting));

router.get("/:id/edit",isLoggedIn,isAdmin, wrapAsync(placementRoute.editlisting_get));

router.put('/:id/edit',isLoggedIn,isAdmin, wrapAsync(placementRoute.editlisting_post));

// Apply from Placement *
router.get("/:id/apply",isLoggedIn,isStudent, placementRoute.applylisting_get);

router.post("/:id/apply",isLoggedIn,isStudent,upload.single("resume"),wrapAsync(placementRoute.applylisting_post));

module.exports=router;