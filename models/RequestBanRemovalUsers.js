const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const RequestBanRemovalUsersSchema = mongoose.Schema({
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
  contact: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
});

RequestBanRemovalUsersSchema.plugin(uniqueValidator);

const DeletedUsers = (module.exports = mongoose.model(
  "RequestBanRemovalUsers",
  RequestBanRemovalUsersSchema
));
