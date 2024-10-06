const express = require("express");
const app = express();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../../models/User/user");
const RehabList = require("../../models/rehabList.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const favouriteController = {
  async addRemoveFav(req, res, next) {
    try {
      const rehabId = req.body.rehabId;
      const userId = req.body.userId;

      const rehab = await RehabList.findOne({ _id: rehabId });
      if (!rehab) {
        const error = new Error("Rehab not found!");
        error.status = 404;
        return next(error);
      }

      const user = await User.findOne({ _id: userId });
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }

      const alreadyExistsIndex = user.savedRehab.indexOf(rehabId);

      if (alreadyExistsIndex !== -1) {
        // If the rehabId is found in the favourites array, remove it using the pull operator
        user.savedRehab.pull(rehabId);
      } else {
        // If the rehabId is not found, add it to the favourites array
        user.savedRehab.push(rehabId);
      }

      // Save the updated user document
      await user.save();

      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  async getAllFav(req, res, next) {
    try {
      const userId = req.query.userId;

      const user = await User.findOne({ _id: userId }).populate("savedRehab");
      console.log(user)
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }
      const favourites = user.savedRehab;
      // Save the updated user document
      await user.save();

      return res.status(200).json({ savedRehab: favourites });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = favouriteController;
