const express = require("express");
const app = express();
const Category = require("../models/category");

const categoryController = {
  async getCategories(req, res, next) {
    try {
      const categories = await Category.find();

      if (!categories) {
        const error = new Error("Categories not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ categories });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = categoryController;
