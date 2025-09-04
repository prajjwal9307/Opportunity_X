const mongoose = require('mongoose');


const placementApplicationSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    universityId: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email address']
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },
    degreeProgram: {
        type: String,
        required: true,
        enum: ['B.Tech', 'B.E', 'MCA', 'M.Tech', 'Other']
    },
    branch: {
        type: String,
        required: true,
        trim: true
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    activeBacklogs: {
        type: Number,
        default: 0,
        min: 0
    },
    passingYear: {
        type: Number,
        required: true
    },
    technicalSkills: {
        type: String,
        required: true,
        trim: true
    },
    certifications: {
        type: String,
        trim: true
    },
   
    resume: {
        url:String,
        filename:String,
        orignalname:String
    },
  
    declaration: {
        type: Boolean,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlacementDrive', 
        required: true
    },
     status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected', 'selected'],
        default: 'pending'
    },
    statusUpdatedAt: {
        type: Date
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', placementApplicationSchema);
