
const { required } = require("joi");
const mongoose = require("mongoose")

const schema = mongoose.Schema;

const student = new schema({
    author: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    firstname: { type: String, default: "null" },
    middlename: { type: String, default: "null" },
    lastname: { type: String, default: "null" }
    ,

    tenmark: { type: String, default: "null" },
    twelthmark: { type: String, default: "null" }
    ,

    cgpa: { type: String, default: "null" },
    branch: { type: String, default: "null" },
    currentyear: { type: String, default: "null" },
    passingyear: { type: String, default: "null" }
    ,
    skills: [String],
    resume: { 
        url:String,
        filename:String,
        orignalname:String
     }
})

module.exports = mongoose.model("Student", student);
