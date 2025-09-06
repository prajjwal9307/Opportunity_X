const express = require("express");
const Router = express.Router();
const nodemailer = require("nodemailer");

const Student = require("../../models/Student/profile.js");
const PlacementDrive = require("../../models/placementdrive.js");
const wrapAsync = require("../../utils/asyncWrapper.js");
const {isAdmin}=require("../../middleware/placement.js")

// Recommendation::--> Admin send Mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "prajjwalraut226@gmail.com",
        pass: process.env.EMAIL_PASS
    }
});

// Function to match users and notify
async function matchUsersToCompaniesAndNotify() {
    // Populate author to get email from User model
    const users = await Student.find({}).populate("author"); 
    const companies = await PlacementDrive.find({});

    for (const company of companies) {
        const companySkills = new Set(company.skills.map(skill => skill.toLowerCase()));

        for (const user of users) {
            // Skip if no author or email
            if (!user.author || !user.author.email) continue;

            const userSkills = new Set(user.skills.map(skill => skill.toLowerCase()));

            // Match logic: check intersection of skills
            const matchedSkills = [...userSkills].filter(skill => companySkills.has(skill));

            if (matchedSkills.length > 4) {
                // Send email
                await transporter.sendMail({
                    from: 'prajjwalraut226@gmail.com',
                    to: user.author.email, // get email from author
                    subject: `Job Opportunity at ${company.companyname}`,
                    html: `
                        <h3>Hi ${user.firstname},</h3>
                        <p>You are eligible to apply for the position <strong>${company.jobrole}</strong> at <strong>${company.companyname}</strong>.</p>
                        <p>Matched Skills: ${matchedSkills.join(', ')}</p>
                        <p>Check more details and apply soon! <a href="https://opportunityx-f72a.onrender.com/placementdrive/${company._id}">Click here</a></p>
                    `
                });
                console.log(`Email sent to: ${user.author.email}`);
            }
        }
    }
}

// Route to trigger notification
Router.get("/",isAdmin, wrapAsync(async (req, res) => {
    await matchUsersToCompaniesAndNotify();
    res.redirect("/admin/dashboard");
}));

module.exports = Router;
