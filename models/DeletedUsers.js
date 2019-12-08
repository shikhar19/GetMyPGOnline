const mongoose = require("mongoose");

const DeletedUsersSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true
  }
});

const DeletedUsers = (module.exports = mongoose.model(
  "DeletedUsers",
  DeletedUsersSchema
));
