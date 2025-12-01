const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const checkPermissionOrOwnRole = require("../middleware/checkPermissionOrOwnRole");
const {
  getPermissionsByRole,
  createOrUpdatePermission,
  getPermissionById,
  getAllPermissions,
  deletePermission,
} = require("../controller/permissionController");

// This should match `menus.code` for your permission module
const MENU_CODE = "permission_management";

// Allow users to view their own role's permissions without permission_management permission
// This is needed for the dashboard to show modules they have access to
// But still require permission_management permission to view other roles' permissions
router.get(
  "/getPermission/:role",
  authmiddleware,
  checkPermissionOrOwnRole(MENU_CODE, "view"),
  getPermissionsByRole
);

router.get(
  "/getAll",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getAllPermissions
);

router.get(
  "/get/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "view"),
  getPermissionById
);

router.post(
  "/create",
  authmiddleware,
  // checkPermission(MENU_CODE, "new"), // ✅ create → new
  createOrUpdatePermission
);

router.delete(
  "/delete/:id",
  authmiddleware,
  checkPermission(MENU_CODE, "delete"),
  deletePermission
);

module.exports = router;
