const express=require('express');
const router=express.Router();

const wrapAsync = require('../../utils/asyncWrapper.js');

const {isLoggedIn}=require("../../middleware/auth.js");
const {isAdmin,isStudent}=require("../../middleware/dsa.js")

const dsa=require("../../controllers/dsa/route.js")


// *
router.get("/compile",isLoggedIn, wrapAsync(dsa.compile_get));

// *
router.post("/compile",isLoggedIn, wrapAsync(dsa.compile_post));

// Create DSA Quetion *
router.get("/addquestion",isLoggedIn,isAdmin, dsa.addlisting_get)

router.post("/addquestion",isLoggedIn,isAdmin, wrapAsync(dsa.addlisting_post));

// show all Question *
router.get("/allquestion",isLoggedIn, wrapAsync(dsa.alllisting));

// Delete DSA Quetion *
router.get("/:id/delete",isLoggedIn,isAdmin, wrapAsync(dsa.destroylisting));

// Details Show *
router.get("/:id/detail",isLoggedIn, wrapAsync(dsa.detailslisting));

module.exports=router;