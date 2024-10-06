const express = require("express");
const app = express();
const RehabList = require("../models/rehabList");

const rehabListController = {
  async getAllRehabLists(req, res, next) {
    try {
      const rehabList = await RehabList.find();

      if (!rehabList) {
        const error = new Error("Rehab List not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ rehabList });
    } catch (error) {
      return next(error);
    }
  },

  async getARehab(req, res, next) {
    try {
        const rehabId = req.query.id;
      const rehab = await RehabList.findOne({_id: rehabId});

      if (!rehab) {
        const error = new Error("Rehab not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ rehab });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = rehabListController;
