const mongoose = require("mongoose");
const Registration = require("../../models/Hackathon/register.js");
const {hackathonSchema} = require('../../schema.js');
const ExpressError = require('../../utils/ExpressError.js');
const Hackathon = require("../../models/Hackathon/hackathon.js");

module.exports.addlisting_get=(req, res) => {
    res.render("hackathon/addhackathon");
};
module.exports.addlisting_post=async (req, res) => {
    let {error}=hackathonSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error.message);
    }
    let { title, date, type, theme, skills, venue, group_member } = req.body;

    const skillsArray = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
            ? skills.split(',').map(s => s.trim())
            : [];

    const newhackthon = new Hackathon({
        title: title,
        date: date,
        type: type,
        theme: theme,
        skills: skillsArray,
        venue: venue,
        group_member: group_member
    });

    await newhackthon.save();
    req.flash("success","New hackathon add successfully!");
    res.redirect("/hackathon/all")
};
module.exports.alllisting=async (req, res) => {
    const allhackathon = await Hackathon.find({});
    if (!allhackathon) {
        throw new ExpressError(404, "Hackathon not found");
    }
    res.render("hackathon/allhackathon", { allhackathon });
};
module.exports.detailslisting=async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
        throw new ExpressError(404, "Hackathon not found");
    }
    res.render("hackathon/detailhackthon", { hackathon });
};
module.exports.destroylisting=async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    let deletehackathon=await Hackathon.findByIdAndDelete(id);
    if(!deletehackathon){
        throw new ExpressError(404,"Hackathon not found")
    }
    const allhackathon = await Hackathon.find({});
    if (!allhackathon) {
        throw new ExpressError(404, "Hackathon not found");
    }
    req.flash("success","Delete hackathon successfully!");
    res.render("hackathon/allhackathon", { allhackathon });
};

module.exports.applylisting_get=async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
        throw new ExpressError(404, "Hackathon not found");
    }
    res.render("hackathon/regitration", { hackathon });
};

module.exports.applylisting_post=async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    let { teamName, leaderName, leaderEmail, leaderContact, teamMembers, hackathonId } = req.body;
    const newregister = new Registration({
        teamName: teamName,
        leaderName: leaderName,
        leaderEmail: leaderEmail,
        leaderContact: leaderContact,
        teamMembers: teamMembers,
        hackathonId: hackathonId
    })
    await newregister.save();


    await Hackathon.findByIdAndUpdate(
        id,
        { $push: { regiterteam: newregister._id } },
        { new: true, useFindAndModify: false }
    );
    req.flash("success","Apply successfully!");
    res.redirect("/hackathon/all");
}
