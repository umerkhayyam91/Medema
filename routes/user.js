const express = require("express");
const userAuthController = require("../controller/User/authController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const categoryController = require("../controller/categoriesController")
const rehabListController = require("../controller/rehabListController")
const favouriteController = require("../controller/User/favouriteController")
const bookingController = require("../controller/User/bookingController")
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
router.post("/user/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.put("/user/updateProfile", auth, userAuthController.updateProfile);
router.post("/user/logout", auth, userAuthController.logout);


router.get("/user/getCategories", categoryController.getCategories);
router.get("/user/getAllRehabLists", rehabListController.getAllRehabLists);
router.get("/user/getARehab", rehabListController.getARehab);

//..................favourites.....................
router.post("/user/addRemoveFav", favouriteController.addRemoveFav);
router.get("/user/getAllFav", favouriteController.getAllFav);

//..........booking...........
router.post("/user/addBooking", bookingController.addBooking);
router.get("/user/getBooking", bookingController.getBooking);
router.get("/user/getAllBookings", bookingController.getAllBookings);



module.exports = router;