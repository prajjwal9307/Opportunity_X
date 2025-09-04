const PlacementDrive=require("../../models/placementdrive");
const Application=require("../../models/application");
const Hackathon=require("../../models/Hackathon/hackathon");
const Registration=require("../../models/Hackathon/register");
const User=require("../../models/User/user.js");

module.exports.dashboard = async (req, res) => {
    try {
        const users =await  User.find({});  
        const placementDrives =await PlacementDrive.find({});
        const applications =await Application.find({});
        const hackathons =await Hackathon.find({});
        const registrations =await Registration.find({}); 
      

        res.render("admin_dashboard/dashboard", {
            admin: req.user,placementDrives,applications,hackathons,registrations,users
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.view_allcompany = async (req, res) => {
    try {
        const allcompany = await PlacementDrive.find({});
        res.render("admin_dashboard/viewjob", { allcompany });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" })
    }
}

module.exports.get_job_application = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await PlacementDrive.findById(id)
            .populate({
                path: 'applications',
                model: 'Application'
            });
        res.render("admin_dashboard/viewjobapplication", { company });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" });
    }
};

module.exports.post_job_application =async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findByIdAndUpdate(
            id,
            {
                status: status,
                statusUpdatedAt: Date.now()
            },
            { new: true }
        );

        res.redirect(`/admin/jobapplication/${application.companyId}/students`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating status');
    }
};
module.exports.student_details = async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await Application.findById(id);
        res.render("admin_dashboard/student_detail", { detail });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" });
    }
};

module.exports.team_details = async (req, res) => {
    try {
        const allhack = await Hackathon.find({});
        res.render("admin_dashboard/viewhack", { allhack });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" })
    }
};

module.exports.get_team_application = async (req, res) => {
    try {
        const { id } = req.params;
        const hack = await Hackathon.findById(id)
            .populate({
                path: 'regiterteam',
                model: 'Registration'
            });

        res.render("admin_dashboard/viewhackapplication", { hack });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" });
    }
}
module.exports.team_student_details=async (req, res) => {
    try {
        const { id } = req.params;
        const detail = await Registration.findById(id);
        res.render("admin_dashboard/team_detail", { detail });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Internal Error" });
    }
}