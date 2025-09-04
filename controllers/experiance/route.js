const mongoose = require("mongoose");
const InterviewExperience = require("../../models/expsharing.js");
const { interviewExperienceSchema } = require('../../schema.js');
const Comment = require("../../models/comments.js");
 const ExpressError = require('../../utils/ExpressError.js');

 
module.exports.addlisting_get=(req, res) => {
    res.render("expsharingplatfrom/explisting");
};
module.exports.addlisting_post=async (req, res) => {

    const { error } = interviewExperienceSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        throw new ExpressError(400, error.message);
    }
    const { company, role, jobType, interviewDate, rounds, overallAdvice } = req.body;

    const processedRounds = rounds.map(round => {
        const processedQuestions = Array.isArray(round.questions)
            ? round.questions.map(q => {
                // Handle both string and object formats
                return typeof q === 'string'
                    ? { questionText: q }
                    : { questionText: q.questionText };
            })
            : [];

        return {
            roundType: round.roundType,
            duration: round.duration,
            questions: processedQuestions,
            experience: round.experience || undefined
        };
    });

    // Create the interview experience document
    const newExperience = new InterviewExperience({
        company,
        role,
        jobType,
        interviewDate: new Date(interviewDate),
        rounds: processedRounds,
        overallAdvice: overallAdvice || undefined,
    });
    newExperience.author = res.locals.currentUser._id;
    await newExperience.save();
    req.flash("success", "Add experiance succesfully!");
    res.redirect("/experiance/all");
};

module.exports.alllisting=async (req, res) => {
    const allInterviewExperience = await InterviewExperience.find({}).populate("author", "username").sort({ createdAt: -1 });
    res.render("expsharingplatfrom/showallexp", { allInterviewExperience });
}
module.exports.detailslisting=async (req, res) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid InterviewExperience ID format");
    }
    const experiance = await InterviewExperience.findById(id).populate({path:"comments",populate:{path: "author", model: "User"}});
    if (!experiance) {
        throw new ExpressError(404, "InterviewExperience not found");
    }
    res.render("expsharingplatfrom/detailsexp", { experiance });
};
module.exports.upvote=async (req, res) => {

    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid InterviewExperience ID format");
    }
    const experience = await InterviewExperience.findById(id);
    if (!experience) {
        throw new ExpressError(404, "InterviewExperience not found");
    }

    experience.upvotes += 1;
    await experience.save();
    req.flash("success", "You like this post!");
    res.redirect(`/experiance/all`);

}
module.exports.comment=async (req, res) => {

    let { comment } = req.body;
    if (!comment) {
        throw new ExpressError(404, "Inter the proper comment");
    }
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid InterviewExperience ID format");
    }
    const newcomment = new Comment({
        text: comment
    })
    newcomment.author = res.locals.currentUser._id;
    await newcomment.save();
    const experience = await InterviewExperience.findById(id);

    if (!experience) {
        throw new ExpressError(404, "InterviewExperience not found");
    }
    experience.comments.push(newcomment._id);
    await experience.save();
    req.flash("success", "You comment this post!");
    res.redirect(`/experiance/${id}`);
};

module.exports.destroyexperiance=async (req, res) => {

    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid InterviewExperience ID format");
    }
    let experience = await InterviewExperience.findById(id);
    if (!experience) {
        throw new ExpressError(404, "InterviewExperience not found");
    }
    if (!experience.author.equals(res.locals.currentUser._id) && res.locals.currentUser.role!=="admin") {
        req.flash("error", "Only owner can delete this experience");
        return res.redirect("/experiance/all");
    }

    if (experience.comments && experience.comments.length > 0) {
        await Comment.deleteMany({ _id: { $in: experience.comments } });
    }
    await InterviewExperience.findByIdAndDelete(id);
    req.flash("success", "Delete successfully!");
    res.redirect("/experiance/all");

}
module.exports.destroycomment=async (req, res) => {

    let { id, commentid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid InterviewExperience ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(commentid)) {
        throw new ExpressError(400, "Invalid comment ID format");
    }

    let experience = await InterviewExperience.findById(id);
    if (!experience) {
        throw new ExpressError(404, "InterviewExperience not found");
    }
    const commentIndex = experience.comments.indexOf(commentid);

    if (commentIndex === -1) {
        throw new ExpressError(404, "Comment not found");
    }
    let comment = await Comment.findById(commentid);
    let commentAuthor = comment.author;

    if (!commentAuthor || (commentAuthor.toString() !== res.locals.currentUser._id.toString() && res.locals.currentUser.role!=="admin")) {
        req.flash("error", "Only owner can delete this comment");
        return res.redirect("/experiance/all");
    }


    experience.comments.splice(commentIndex, 1);
    await experience.save();

    await Comment.findByIdAndDelete(commentid);
    req.flash("success", "Delete comment successfully!");
    res.redirect(`/experiance/${id}`);

}

