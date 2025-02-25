



const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/FormUser");

const userSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  memberName: { type: String, required: true },
  memberEmail: { type: String, required: true, unique: true },
});

// Ensure `User` is correctly exported
const User = mongoose.model("User", userSchema);
module.exports = User;
