const mongoose = require("mongoose");
const axios = require("axios");

const ExpressError = require('../../utils/ExpressError.js');
const Question=require("../../models/DSA/quetionSchema.js");


// DSA Compiler
const JUDGE0_API = process.env.JUDGE0_API;
const RAPIDAPI_KEY =process.env.RAPIDAPI_KEY;

module.exports.compile_get=async (req, res) => {
    res.render("DSACompiler/index.ejs");
};

module.exports.compile_post=async (req, res) => {
    const { code, language_id } = req.body;

    const submissionRes = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
            source_code: code,
            language_id: parseInt(language_id),
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
        }
    );

    const token = submissionRes.data.token;

    let result;
    while (true) {
        const resCheck = await axios.get(`${JUDGE0_API}/submissions/${token}?base64_encoded=false`, {
            headers: {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
        });

        result = resCheck.data;

        if (result.status.id <= 2) {
            await new Promise(r => setTimeout(r, 1000));
        } else {
            break;
        }
    }

    res.json(result);

};

module.exports.addlisting_get=(req, res) => {
    res.render("DSACompiler/createQuetion")
}
module.exports.addlisting_post=async (req, res) => {

    const {
        questionType,
        title,
        description,
        difficulty,
        tags,
        options,
        correctAnswer,
        inputFormat,
        outputFormat,
        constraints,
        timeLimit,
        memoryLimit,
        solution,
        testCases
    } = req.body;

    if (!questionType || !title || !description || !difficulty) {
        throw new ExpressError(400, "Missing required fields");
    }

    const newQuestion = new Question({
        questionType,
        title,
        description,
        difficulty,
        tags: tags.split(',').map(tag => tag.trim()),
        options,
        correctAnswer,
        inputFormat,
        outputFormat,
        constraints,
        testCases,
        timeLimit: parseInt(timeLimit) || 2,
        memoryLimit: parseInt(memoryLimit) || 256,
        solution,
        createdAt: new Date()  // Add creation timestamp
    });

    await newQuestion.save();
    req.flash("success","Add question successfully!");
    res.redirect("/dsa/allquestion")
}

module.exports.alllisting=async (req, res) => {

    const allQuestion = await Question.find({}).sort({ createdAt: -1 });
    if (!allQuestion || allQuestion.length === 0) {
        throw new ExpressError(400, "DSA Quetion Not LISTED");
    }
    res.render("DSACompiler/allQuestion.ejs", { allQuestion });
}

module.exports.destroylisting=async (req, res) => {

    let { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    let deletequestion=await Question.findByIdAndDelete(id);
    if(!deletequestion){
        throw new ExpressError(404,"Quetion not found")
    }
    req.flash("success","Delete question successfully!");
    res.redirect("/dsa/allquestion");
}
module.exports.detailslisting=async (req, res) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Question ID format");
    }
    const question = await Question.findById(id);
    if (!question) {
        throw new ExpressError(404, "Question not found");
    }
    if (question.questionType === "CODING") {
        res.render("DSACompiler/index", { question });
    } else {
        res.render("DSACompiler/index1", { question });
    }
}