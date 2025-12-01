const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} = require("../controller/moduleController");

// Match this with `menuId` column from your `menus` table
const MENU_CODE = "module_management";

router.get(
  "/all_modules",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getAllModules
);

router.get("/fetch_all_modules", authmiddleware, getAllModules);

router.get(
  "/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getModuleById
);

router.post(
  "/",
  authmiddleware,
  checkPermission(MENU_CODE, "new"), // ✅ create → new
  createModule
);

router.put(
  "/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "edit"), // ✅ update → edit
  updateModule
);

router.delete(
  "/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "delete"),
  deleteModule
);

module.exports = router;
