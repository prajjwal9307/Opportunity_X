const express = require("express");
const router = express.Router({ mergeParams: true });

const multer=require("multer")
const {storage}=require("../../cloudConfig.js")
const upload=multer({storage,limits:{ fileSize: 500 * 1024 }});

const profile=require("../../controllers/profile/route.js");

// Profile
router.get("/", profile.profile_get)

router.post("/", upload.single("resume"),profile.profile_post);

module.exports = router;

