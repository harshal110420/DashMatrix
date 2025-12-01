const { Sequelize } = require("sequelize");
const { dashMatrixSequelize, sequelizeWebsite } = require("../config/db");

// ==============================
// 🧩 MODEL IMPORTS (Talent Gate)
// ==============================

const Department = require("./Department")(dashMatrixSequelize);
const Module = require("./ModuleModel")(dashMatrixSequelize);
const Menu = require("./MenuModel")(dashMatrixSequelize);
const Permission = require("./Permission")(dashMatrixSequelize);
const Role = require("./Role")(dashMatrixSequelize);
const User = require("./User")(dashMatrixSequelize);
const UserPermission = require("./UserPermission")(dashMatrixSequelize);

// ==============================
// 📦 CREATE DB OBJECT FIRST
// ==============================
const DashMatrixDB = {
  sequelize: dashMatrixSequelize,
  Sequelize,
  Department,
  Module,
  Menu,
  Permission,
  Role,
  User,
  UserPermission,
};

// ==============================
// 🔗 MANUAL ASSOCIATIONS (ORDERED)
// ==============================

// --- Module ↔ Menu
Module.hasMany(Menu, { foreignKey: "moduleId", as: "menus" });
Menu.belongsTo(Module, { foreignKey: "moduleId", as: "module" });

// --- Role ↔ Permission ↔ Menu
Role.hasMany(Permission, { foreignKey: "roleId", as: "permissions" });
Permission.belongsTo(Role, { foreignKey: "roleId", as: "role" });

Menu.hasMany(Permission, { foreignKey: "menuId", as: "permissions" });
Permission.belongsTo(Menu, { foreignKey: "menuId", as: "menu" });

// --- User ↔ UserPermission ↔ Menu
User.hasMany(UserPermission, { foreignKey: "userId", as: "userPermissions" });
UserPermission.belongsTo(User, { foreignKey: "userId", as: "user" });

Menu.hasMany(UserPermission, { foreignKey: "menuId", as: "userPermissions" });
UserPermission.belongsTo(Menu, { foreignKey: "menuId", as: "menu" });

// --- Department ↔ User
Department.hasMany(User, { foreignKey: "departmentId", as: "users" });
User.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

// --- User ↔ Role
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// ==============================
// 🔗 AUTO-ASSOCIATE (IF AVAILABLE)
// ==============================
Object.values(DashMatrixDB).forEach((model) => {
  if (model?.associate) {
    model.associate(DashMatrixDB);
  }
});

// ==============================
// WEBSITE MODELS (Future)
// ==============================
const WebsiteDB = {
  sequelize: sequelizeWebsite,
  Sequelize,
};

// ==============================
module.exports = { DashMatrixDB, WebsiteDB };
