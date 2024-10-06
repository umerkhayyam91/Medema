const express = require("express");
const vendorAuthController = require("../controller/Vendor/authController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/vendor/register", vendorAuthController.register);
router.post("/vendor/login", vendorAuthController.login);
router.post("/vendor/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.put("/vendor/updateProfile", auth, vendorAuthController.updateProfile);
router.post("/vendor/logout", auth, vendorAuthController.logout);


module.exports = router;
 