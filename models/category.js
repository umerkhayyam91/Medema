const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  images: {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  name: {   
    type: String,
    required: true,
  }
});

const user = mongoose.model("category", categorySchema, "categories");

module.exports = user;
