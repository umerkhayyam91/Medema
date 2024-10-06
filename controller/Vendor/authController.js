const express = require("express");
const app = express();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const Vendor = require("../../models/vendor/vendor")
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const vendorAuthController = {
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      address: Joi.string().required(),
      availability: Joi.string().required(),
      city: Joi.string().required(),
      details: Joi.string().required(),
      dob: Joi.string().required(),
      education: Joi.string().required(),
      email: Joi.string().required(),
      experience: Joi.string().required(),
      gender: Joi.string().required(),
      images: Joi.string().required(),
      lat: Joi.string().required(),
      long: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      phone: Joi.string().required(),
      ref: Joi.string().required(),
      rgNo: Joi.string().required(),
      speciality: Joi.string().required(),
      unAvailability: Joi.string().required(),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      address,
      availability,
      city,
      details,
      dob,
      education,
      email,
      experience,
      gender,
      images,
      lat,
      long,
      name,
      password,
      phone,
      ref,
      rgNo,
      speciality,
      unAvailability
    } = req.body;

    let accessToken;
    let refreshToken;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      const userToRegister = new Vendor({
        address,
        availability,
        city,
        details,
        dob,
        education,
        email,
        experience,
        gender,
        images,
        lat,
        long,
        name,
        password: hashedPassword,
        phone,
        ref,
        rgNo,
        speciality,
        unAvailability
      });

      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);
    await JWTService.storeAccessToken(accessToken, user._id);

    // 6. response send

    // const userDto = new usertorDto(user);

    return res
      .status(201)
      .json({ user: user, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let doc;

    try {
      // match username
      doc = await Vendor.findOne({ email: email });
      if (!doc) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

    //     return next(error);
    //   }
    //   if (doc.isVerified == false) {
    //     const error = {
    //       status: 401,
    //       message: "User not verified",
    //     };

    //     return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, doc.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: doc._id }, "365d");
    const refreshToken = JWTService.signRefreshToken({ _id: doc._id }, "365d");
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: doc._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    try {
      await AccessToken.updateOne(
        {
          userId: doc._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }


    return res
      .status(200)
      .json({ user: doc, auth: true, token: accessToken });
  },

  async updateProfile(req, res, next) {
    const docSchema = Joi.object({
      address: Joi.string(),
      availability: Joi.string(),
      city: Joi.string(),
      details: Joi.string(),
      dob: Joi.string(),
      education: Joi.string(),
      email: Joi.string(),
      experience: Joi.string(),
      gender: Joi.string(),
      images: Joi.string(),
      lat: Joi.string(),
      long: Joi.string(),
      name: Joi.string(),
      password: Joi.string().pattern(passwordPattern),
      phone: Joi.string(),
      ref: Joi.string(),
      rgNo: Joi.string(),
      speciality: Joi.string(),
      unAvailability: Joi.string(),
    });

    const { error } = docSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      address,
      availability,
      city,
      details,
      dob,
      education,
      email,
      experience,
      gender,
      images,
      lat,
      long,
      name,
      password,
      phone,
      ref,
      rgNo,
      speciality,
      unAvailability
    } = req.body;
    const docId = req.user._id;

    const doc = await Vendor.findById(docId);

    if (!doc) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (address) doc.address = address;
    if (email) doc.email = email;
    if (availability) doc.availability = availability;
    if (city) doc.city = city;
    if (password) doc.password = password;
    if (city) doc.city = city;
    if (details) doc.details = details;
    if (dob) doc.dob = dob;
    if (education) doc.education = education;
    if (experience) doc.experience = experience;
    if (gender) doc.gender = gender;
    if (images) doc.images = images;
    if (lat) doc.lat = lat;
    if (long) doc.long = long;
    if (name) doc.name = name;
    if (phone) doc.phone = phone;
    if (ref) doc.ref = ref;
    if (rgNo) doc.rgNo = rgNo;
    if (speciality) doc.speciality = speciality;
    if (unAvailability) doc.unAvailability = unAvailability;

    // Save the updated test
    await doc.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", user: doc });
  },

  async logout(req, res, next) {
    // 1. delete refresh token from db
    // const refHeader = req.headers["refreshToken"];
    // const refreshToken = refHeader && refHeader.split(" ")[1];
    const userId = req.user._id;
    // console.log(userId)
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    // console.log("object");
    // console.log(accessToken);
    // console.log(refreshToken);
    try {
      await RefreshToken.deleteOne({ userId });
    } catch (error) {
      return next(error);
    }
    try {
      await AccessToken.deleteOne({ token: accessToken });
    } catch (error) {
      return next(error);
    }

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },
};

module.exports = vendorAuthController;
