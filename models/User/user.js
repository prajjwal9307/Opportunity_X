
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true }, // remove required:true
  role: { type: String, enum: ["student", "admin"], default: "student" }
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);


