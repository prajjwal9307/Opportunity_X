const Student = require("../../models/Student/profile.js");
const experiance = require("../../models/expsharing.js");
const Application=require("../../models/application.js");
const Registration=require("../../models/Hackathon/register.js");

module.exports.profile_get=async (req, res) => {
  let id = req.params.id;
  let student = await Student.findOne({ author: id })
  let experiances = await experiance.find({ author: id });
  let applications=await Application.find({author:id}).populate("companyId");
  let hackathons=await Registration.find({author:id}).populate("hackathonId");
  if (!student) {
    student = new Student({ author: id });
    await student.save();
  }
  res.render("Student/profile.ejs", { student,experiances,applications,hackathons});
};

module.exports.profile_post=async (req, res) => {
  try {
    let { firstname, middlename, lastname, tenmark, twelthmark, cgpa, branch, currentyear, passingyear, skills } = req.body;
    let id = req.params.id;
    let student = await Student.findOne({ author: id });
    if (!student) return res.status(404).send("Student not found");

    // Update fields
    student.firstname = firstname || student.firstname;
    student.middlename = middlename || student.middlename;
    student.lastname = lastname || student.lastname;
    student.tenmark = tenmark || student.tenmark;
    student.twelthmark = twelthmark || student.twelthmark;
    student.cgpa = cgpa || student.cgpa;
    student.branch = branch || student.branch;
    student.currentyear = currentyear || student.currentyear;
    student.passingyear = passingyear || student.passingyear;

    // Handle skills (comma separated string → array)
    if (skills) {
      student.skills = skills.split(",").map(s => s.trim()).filter(s => s.length > 0);
    }
    if(req.file){
        student.resume={
         url:req.file.path,
         orignalname:req.file.originalname,
         filename:req.file.filename,
        }
    }
    
    await student.save();

    res.redirect(`/${id}/profile`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

