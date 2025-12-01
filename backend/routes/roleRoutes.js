const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");

const {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
} = require("../controller/roleController");

// 👇 CRUD Routes for Role with Permission Check
router.post(
  "/create",
  authMiddleware,
  checkPermission("role_management", "new"), // ✅ Only if role has "new" action
  createRole
);

router.get(
  "/all",
  authMiddleware,
  checkPermission("role_management", "view"), // ✅ Only if role has "view" action
  getAllRoles
);

router.get("/all_roles", authMiddleware, getAllRoles);

router.get(
  "/get/:id",
  authMiddleware,
  checkPermission("role_management", "view"), // ✅ Even single-role fetch should require view
  getSingleRole
);

router.put(
  "/update/:id",
  authMiddleware,
  checkPermission("role_management", "edit"), // ✅ Only if role has "edit" action
  updateRole
);

router.delete(
  "/delete/:id",
  authMiddleware,
  checkPermission("role_management", "delete"), // ✅ Only if role has "delete" action
  deleteRole
);

module.exports = router;
