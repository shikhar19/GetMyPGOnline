const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const DeletedUsersSchema = mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyEmail: {
    token: {
      type: String
    },
    expiresIn: {
      type: Date
    }
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

// const DeletedUsersSchema = mongoose.Schema({
//   deletedID: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   email: {
//     type: String,
//     unique: true,
//     index: true,
//     required: true
//   }
// });

const DeletedUsers = (module.exports = mongoose.model(
  "DeletedUsers",
  DeletedUsersSchema
));
