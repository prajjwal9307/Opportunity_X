const express=require('express');
const router=express.Router();

const {isAdmin}=require("../../middleware/placement.js")
const wrapAsync = require('../../utils/asyncWrapper.js');

const admin=require("../../controllers/admin/route.js");

// Add this after your registration routes
router.get("/dashboard",isAdmin, admin.dashboard);

// Admin Only
// View Job Appliction
router.get("/jobapplication",isAdmin, wrapAsync(admin.view_allcompany));

router.get("/jobapplication/:id/students",isAdmin, wrapAsync(admin.get_job_application));

// Update application status
router.post("/jobapplication/:id/status",isAdmin, wrapAsync(admin.post_job_application));

router.get("/application/:id/student_details",isAdmin, wrapAsync(admin.student_details));

// View Hack Application
router.get("/hackapplication",isAdmin, wrapAsync(admin.team_details));

router.get("/hackapplication/:id/students",isAdmin, wrapAsync(admin.get_team_application));

router.get("/application/:id/team_details",isAdmin, wrapAsync(admin.team_student_details));

module.exports=router;