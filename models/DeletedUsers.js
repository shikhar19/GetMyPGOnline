const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const DeletedUsersSchema = mongoose.Schema({
  img: {
    id: String,
    url: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetPwd: {
    token: {
      type: String
    },
    expiresIn: {
      type: Date
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isContactVerified: {
    type: Boolean,
    default: false
  },
  contact: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

DeletedUsersSchema.plugin(uniqueValidator);

const DeletedUsers = (module.exports = mongoose.model(
  "DeletedUsers",
  DeletedUsersSchema
));
