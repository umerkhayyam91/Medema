const mongoose = require("mongoose");

const rehabSvhema = new mongoose.Schema({
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  discount: {   
    type: String,
  },
  doctorAvail: {
    type: Boolean,
  },
  newPrice: {
    type: Boolean,
  },
  oldPrice: {
    type: Boolean,
  },
  title: {
    type: Boolean,
  },
  dob: {
    type: String,
  },
  fees: {
    type: String,
  },
  email: {
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
  parkingFacility: {
    type: Boolean,
  },
  perDay: {
    type: String,
  },
  perHour: {
    type: String,
  },
  powerBackup: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const user = mongoose.model("Rehab List", rehabSvhema, "rehab list");

module.exports = user;
