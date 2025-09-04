const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        maxlength: [50, 'Team name cannot exceed 50 characters']
    },
    leaderName: {
        type: String,
        required: [true, 'Leader name is required'],
        trim: true
    },
    teamMembers: {
        type: [String],
        required: [true, 'At least one team member is required'],
        validate: {
            validator: function(members) {
                return members.length >= 1; // Minimum 1 team member (leader plus others)
            },
            message: 'At least one team member is required'
        }
    },
    leaderEmail: {
        type: String,
        required: [true, 'Leader email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    leaderContact: {
        type: String,
        required: [true, 'Leader contact number is required'],
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit contact number']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    }
});

// Create the model
const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;