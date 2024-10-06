const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user"
    },
    password: {
      type: String,
      required: true,
    },
    savedRehab: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Rehab List', // Reference to the RehabList model
      default: []
    }],
    createdAt: {
      type: Date,
      default: Date.now()
    },
  }
);

const user = mongoose.model(
  "user",
  userSchema,
  "users"
);

module.exports = user;
