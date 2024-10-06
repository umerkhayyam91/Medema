const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  availability: {
    type: String,
  },
  city: {   
    type: String,
  },
  details: {
    type: String,
  },
  dob: {
    type: String,
  },
  education: {
    type: String,
  },
  email: {
    type: String,
  },
  experience: {
    type: String,
  },
  gender: {
    type: String,
  },
  images: {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  lat: {
    type: String,
  },
  long: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  ref: {
    type: String,
  },
  rgNo: {
    type: String,
  },
  speciality: {
    type: String,
  },
  unAvailability: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const user = mongoose.model("vendor", vendorSchema, "vendors");

module.exports = user;
