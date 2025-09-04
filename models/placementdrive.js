const mongoose = require("mongoose");

const PlacementDriveSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true
    },
    companydetail: {
        type: String,
        required: true
    },
    jobrole: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    applicationdeadline: {
        type: Date,
        required: true
    },
    package: {
        type: Number,
        required: true
    },
    processofround: {
        type: String,
        required: true
    },
    drivedate: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    applications: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        }],
        default: []
    }
});

module.exports = mongoose.model("PlacementDrive", PlacementDriveSchema);
