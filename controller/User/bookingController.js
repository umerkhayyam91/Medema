const express = require("express");
const app = express();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../../models/User/user");
const Booking = require("../../models/User/booking");
const RehabList = require("../../models/rehabList.js");

const bookingController = {
  async addBooking(req, res, next) {
    try {
      console.log("object");
      const userRegisterSchema = Joi.object({
        recieverId: Joi.string(),
        userId: Joi.string(),
        package: Joi.string(),
        amount: Joi.string(),
        from: Joi.string(),
        to: Joi.string(),
        patientName: Joi.string(),
        gender: Joi.string(),
        message: Joi.string(),
        phone: Joi.string(),
        altPhone: Joi.string(),
        DOB: Joi.string(),
        rate: Joi.string(),
        type: Joi.string(),
        reasonForBooking: Joi.string(),
      });
      const receiverId = req.body.recieverId;
      const userId = req.body.userId;
      const { error } = userRegisterSchema.validate(req.body);
      const receiver = await RehabList.findById(receiverId);
      if (!receiver) {
        const error = new Error("Invalid Receiver Id!");
        error.status = 404;
        return next(error);
      }
      const receiverName = receiver.name;
      if (error) {
        return next(error);
      }

      const {
        package,
        amount,
        from,
        to,
        patientName,
        gender,
        message,
        phone,
        altPhone,
        DOB,
        rate,
        type,
        reasonForBooking
      } = req.body;

      let user;
      const userToRegister = new Booking({
        receiverName,
        userId,
        package,
        amount,
        from,
        to,
        patientName,
        gender,
        message,
        phone,
        altPhone,
        DOB,
        rate,
        type,
        reasonForBooking
      });
      user = await userToRegister.save();
      return res.status(201).json({ booking: user, status: true });
    } catch (error) {
      return next(error);
    }
  },

  async getBooking(req, res, next) {
    try {
      const id = req.query.bookingId;

      const booking = await Booking.findOne({ _id: id });
      if (!booking) {
        const error = new Error("Booking not found!");
        error.status = 404;
        return next(error);
      }
      // Save the updated user document

      return res.status(200).json({ booking: booking });
    } catch (error) {
      return next(error);
    }
  },

  async getAllBookings(req, res, next) {
    try {
      const id = req.query.userId;

      const booking = await Booking.find({ userId: id });
      if (!booking) {
        const error = new Error("No bookings found!");
        error.status = 404;
        return next(error);
      }
      // Save the updated user document

      return res.status(200).json({ bookings: booking });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = bookingController;
