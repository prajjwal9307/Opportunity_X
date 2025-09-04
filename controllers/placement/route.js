
const PlacementDrive = require("../../models/placementdrive");
const ExpressError = require('../../utils/ExpressError.js');
const { placementDriveSchema, applicationSchema } = require('../../schema.js');
const Application = require("../../models/application.js")
const mongoose = require("mongoose");

module.exports.listingcompany_get = (req, res) => {
    res.render("placementdrive/listing")
};

module.exports.listingcompany_post = async (req, res) => {

    const { error, value } = placementDriveSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    }
    const skills = value.skills;
    const skillsArray = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
            ? skills.split(',').map(s => s.trim())
            : [];


    const newplacementdrive = new PlacementDrive({
        companyname: value.companyname,
        companydetail: value.companydetail,
        jobrole: value.jobrole,
        eligibility: value.eligibility,
        applicationdeadline: value.applicationdeadline,
        package: value.package,
        processofround: value.processofround,
        drivedate: value.drivedate,
        venue: value.venue,
        skills: skillsArray
    })
    req.flash("success", "New company add successfully!");
    newplacementdrive.save();
    res.redirect("/placementdrive")
}

module.exports.alllistingcompany = async (req, res) => {

    const sortOrder = req.query.sort || 'desc'; // Default to descending
    const sortOption = sortOrder === "asc" ? { package: 1 } : { package: -1 };

    const allcompany = await PlacementDrive.find({}).sort(sortOption).exec();

    res.render("placementdrive/alllisting", {
        allcompany,
        sortOrder
    });
};

module.exports.detailslisting = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid company ID format");
    }
    const companydetails = await PlacementDrive.findById(id);
    if (!companydetails) {
        throw new ExpressError(404, "Company not found");
    }
    res.render("placementdrive/list_details", { companydetails });
};

module.exports.destroylisting = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid company ID format");

    }
    const deletedDrive = await PlacementDrive.findByIdAndDelete(id);
    if (!deletedDrive) {
        throw new ExpressError(404, "Company not found");
    }
    req.flash("success", "Delete company successfully!");
    res.redirect("/placementdrive");
};

module.exports.editlisting_get = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid company ID format");
    }
    const updatedrive = await PlacementDrive.findById(id);
    if (!updatedrive) {
        throw new ExpressError(404, "Company not found");
    }
    res.render("placementdrive/update_listing", { updatedrive });
};

module.exports.editlisting_post = async (req, res) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid company ID format");
    }

    const updatedrive = await PlacementDrive.findById(id);
    if (!updatedrive) {
        throw new ExpressError(404, "Company not found");
    }
    await PlacementDrive.findByIdAndUpdate(id, req.body);
    req.flash("success", "Update company successfully!");
    res.redirect(`/placementdrive/${id}`);
};

module.exports.applylisting_get = async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid company ID format");
    }

    const companydetails = await PlacementDrive.findById(id);
    if (!companydetails) {
        throw new ExpressError(404, "Company not found");
    }
    res.render("placementdrive/apply", { companydetails });
}
module.exports.applylisting_post = async (req, res) => {

    const { id } = req.params;
    const company = await PlacementDrive.findById(id)
    // Joi validation
    const { error } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        throw new ExpressError(400, error.message);
    }
    if (!req.file) {
      req.flash("error", "select resume");
      res.redirect(`/placementdrive/${id}`);
    }

    // Extract validated values
    const {
        fullName, universityId, email, phone, degreeProgram,
        branch, cgpa, activeBacklogs, passingYear, technicalSkills,
        certifications, declaration
    } = req.body;


    const newApplication = new Application({
        fullName,
        universityId,
        email,
        phone,
        degreeProgram,
        branch,
        cgpa,
        activeBacklogs,
        passingYear,
        technicalSkills,
        certifications,
        declaration,
        companyId: id
    });
    newApplication.author = res.locals.currentUser._id;

    if (req.file) {
        newApplication.resume = {
            url: req.file.path,
            orignalname: req.file.originalname,
            filename: req.file.filename,
        }
    }
    await newApplication.save();
    company.applications.push(newApplication._id)
    await company.save();
    req.flash("success", "Succesfully Apply!");
    res.redirect(`/placementdrive/${id}`);
    ;
}
