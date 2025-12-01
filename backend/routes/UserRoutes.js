const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");

const {
  createUser,
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../controller/userController");

// 👇 Ye code value same honi chahiye as stored in `menus.code`
const MENU_CODE = "user_management";

router.post(
  "/create",
  authmiddleware,
  checkPermission(MENU_CODE, "new"),
  createUser
);

router.get(
  "/all",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getAllUsers
);

router.get(
  "/get/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getUserByID
);

router.put(
  "/update/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "edit"),
  updateUser
);

router.delete(
  "/delete/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "delete"),
  deleteUser
);

module.exports = router;
