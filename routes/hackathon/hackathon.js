const express=require('express');
const router=express.Router();



const Hackathon = require("../../models/Hackathon/hackathon.js");
const wrapAsync = require('../../utils/asyncWrapper.js');
const {isLoggedIn}=require("../../middleware/auth.js");
const {isAdmin,isStudent}=require("../../middleware/hackathon.js")


const hackathontRoute=require("../../controllers/hackthon/route.js")


// Hackathon Collaboration System *
router.get("/add",isLoggedIn,isAdmin, hackathontRoute.addlisting_get)

router.post("/add",isLoggedIn,isAdmin, wrapAsync(hackathontRoute.addlisting_post));

// Hackthon Show *
router.get("/all",isLoggedIn, wrapAsync(hackathontRoute.alllisting));

// Details Hackthon Show *
router.get("/:id",isLoggedIn, wrapAsync(hackathontRoute.detailslisting));

// delete Hackathon *
router.get("/delete/:id",isLoggedIn,isAdmin,wrapAsync(hackathontRoute.destroylisting));

// Apply for Hackthon
router.get("/:id/register",isLoggedIn,isStudent, wrapAsync(hackathontRoute.applylisting_get));


router.post("/:id/register",isLoggedIn,isStudent, wrapAsync(hackathontRoute.applylisting_post));


// Build Search Bar And Display All Student match Skill
// Modify After Login Create 
// Pending the work 

router.get("/:id/findteammate", async (req, res) => {
    try {
        const hackathonId = req.params.id;

        // Get the hackathon details
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        // Check if hackathon has required skills
        if (!hackathon.skills || hackathon.skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "This hackathon hasn't specified required skills"
            });
        }

        // Get all users with skills
        const users = await User.find({ skills: { $exists: true, $not: { $size: 0 } } });

        // Normalize hackathon skills for matching
        const hackathonSkills = hackathon.skills.map(skill => skill.toLowerCase());

        // Find matching users
        const matchedUsers = [];

        for (const user of users) {
            const userSkills = user.skills.map(skill => skill.toLowerCase());

            // Find intersection between user skills and hackathon skills
            const matchedSkills = userSkills.filter(userSkill =>
                hackathonSkills.some(hackSkill =>
                    hackSkill === userSkill ||
                    userSkill.includes(hackSkill) ||
                    hackSkill.includes(userSkill)
                )
            );

            if (matchedSkills.length > 0) {
                matchedUsers.push({
                    user,
                    matchedSkills,
                    matchPercentage: (matchedSkills.length / hackathonSkills.length * 100).toFixed(2)
                });
            }
        }

        // Sort by best matches first (highest percentage)
        matchedUsers.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Send emails to matched users
        const emailResults = [];
        for (const match of matchedUsers) {
            const { user, matchedSkills, matchPercentage } = match;

            try {
                await transporter.sendMail({
                    from: 'prajjwalraut226@gmail.com',
                    to: user.email,
                    subject: `🚀 You're a Perfect Match for ${hackathon.title} Hackathon!`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                                <h2 style="color: #2c3e50; margin-top: 0;">Hello ${user.name},</h2>
                                <p style="font-size: 16px;">Your skills perfectly align with what we need for <strong>${hackathon.title}</strong> hackathon!</p>
                                
                                <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                                    <h3 style="margin-top: 0; color: #3498db;">Hackathon Details</h3>
                                    <p><strong>Theme:</strong> ${hackathon.theme}</p>
                                    <p><strong>Date:</strong> ${hackathon.date.toDateString()}</p>
                                    <p><strong>Type:</strong> ${hackathon.type}</p>
                                    <p><strong>Team Size:</strong> ${hackathon.group_member} members</p>
                                    <p><strong>Your Match Score:</strong> ${matchPercentage}%</p>
                                    <p><strong>Matched Skills:</strong> ${matchedSkills.join(', ')}</p>
                                </div>
                                
                                <p style="font-size: 15px;">We believe your expertise in these areas would make you a valuable participant!</p>
                                
                                <div style="text-align: center; margin: 25px 0;">
                                    <a href="http://yourdomain.com/hackathon/${hackathon._id}" 
                                       style="background-color: #3498db; color: white; padding: 12px 24px; 
                                              text-decoration: none; border-radius: 5px; font-weight: bold;
                                              display: inline-block;">
                                        Join This Hackathon
                                    </a>
                                </div>
                                
                                <p style="font-size: 14px; color: #7f8c8d;">Deadline for registration: ${new Date(hackathon.date.getTime() - (3 * 24 * 60 * 60 * 1000)).toDateString()}</p>
                            </div>
                            
                            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #95a5a6;">
                                Best regards,<br/>
                                <strong>${hackathon.title} Organizing Team</strong>
                            </p>
                        </div>
                    `
                });

                emailResults.push({
                    userId: user._id,
                    email: user.email,
                    status: 'sent',
                    matchedSkills
                });

                console.log(`Email successfully sent to ${user.email}`);
            } catch (emailErr) {
                emailResults.push({
                    userId: user._id,
                    email: user.email,
                    status: 'failed',
                    error: emailErr.message
                });
                console.error(`Failed to send email to ${user.email}:`, emailErr);
            }
        }

        res.json({
            success: true,
            message: `Found ${matchedUsers.length} potential participants out of ${users.length} users`,
            hackathon: {
                id: hackathon._id,
                title: hackathon.title,
                requiredSkills: hackathon.skills
            },
            matchingStats: {
                totalUsers: users.length,
                matchedUsers: matchedUsers.length,
                matchRate: `${((matchedUsers.length / users.length) * 100).toFixed(2)}%`
            },
            emailResults,
            bestMatches: matchedUsers.slice(0, 5).map(m => ({
                userId: m.user._id,
                name: m.user.name,
                email: m.user.email,
                matchPercentage: m.matchPercentage,
                matchedSkills: m.matchedSkills
            }))
        });

    } catch (err) {
        console.error("Error in find teammate route:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
});

module.exports=router;