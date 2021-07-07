const { Schema, model } = require("mongoose");
const Child = require("../models/Child");

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['parent', 'teacher', 'admin'],
    default: 'parent', 
  },
  child: [{
    type: Schema.Types.ObjectId,
    ref: Child
  }],
 
});

const User = model("User", userSchema);

module.exports = User;
