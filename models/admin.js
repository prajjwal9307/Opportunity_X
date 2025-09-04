const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    }
}, { timestamps: true });

AdminSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameUnique: true
});

module.exports = mongoose.model("Admin", AdminSchema);