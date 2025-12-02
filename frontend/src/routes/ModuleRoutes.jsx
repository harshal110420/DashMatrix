import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllGroupedMenus } from "../features/menus/menuSlice";
import { fetchAllModules } from "../features/Modules/ModuleSlice";
import LoadingScreen from "../components/skeletons/LoadingScreen";
import RolesPage from "../pages/Administration/Roles/RolesPage";
import RoleForm from "../pages/Administration/Roles/RoleForm";
import MenuPage from "../pages/System/Menus/MenuPage";
import MenuForm from "../pages/System/Menus/MenusForm";
import PermissionsPage from "../pages/System/Permission/PermissionPage";
import UserPage from "../pages/Administration/User/UsersPage";
import UserForm from "../pages/Administration/User/UserForm";
import DepartmentPage from "../pages/Administration/Department/DepartmentPage";
import DepartmentForm from "../pages/Administration/Department/DepartmentForm";
import ModulePage from "../pages/System/Module/ModulePage";
import ModuleForm from "../pages/System/Module/ModuleForm";
import NotFoundPage from "../components/common/NotFoundPage";
import UserPermissionWrapper from "../pages/Administration/User/UserPermissionWrapper";
const ModuleRoutes = ({ moduleName }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Get modules from permission state (same as ModuleLayout uses)
  // This ensures consistency - modules come from permissions which user has access to
  const permissionModules = useSelector((state) => state.userPermission.loggedInUserPermissions);
  const allModulesList = useSelector((state) => state.modules.list);
  const menus = useSelector((state) => state.menus.list);
  const menusLoading = useSelector((state) => state.menus.loading);
  const modulesLoading = useSelector((state) => state.modules.loading);

  // Ensure menus and modules are loaded
  useEffect(() => {
    if (menus.length === 0 && !menusLoading) {
      dispatch(fetchAllGroupedMenus());
    }
    if (allModulesList.length === 0 && !modulesLoading) {
      dispatch(fetchAllModules());
    }
  }, [dispatch, menus.length, allModulesList.length, menusLoading, modulesLoading]);

  // Try to find module in permission modules first (has modulePath)
  let currentModule = permissionModules?.find(
    (module) => module.modulePath === moduleName
  );

  // Fallback to all modules list if not found in permission modules (has path)
  if (!currentModule) {
    currentModule = allModulesList.find((module) => module.path === moduleName);
  }

  const isBasePath = location.pathname === `/module/${moduleName}`;

  // Show loading while fetching data
  if ((menusLoading || modulesLoading) && menus.length === 0) {
    return <LoadingScreen />;
  }

  // If the current module doesn't exist in the Redux state, show not found
  // Don't redirect to /unauthorized as that route might not exist
  if (!currentModule) {
    return <NotFoundPage />;
  }

  // Get menus from currentModule (from permissions) - this has the correct structure
  // Menus are organized by category: { Master: [], Transaction: [], Report: [] }
  const moduleMenusByCategory = currentModule.menus || {};

  // Flatten all menus from all categories into a single array
  const currentModuleMenus = Object.values(moduleMenusByCategory).flat();

  // Also keep the flat menus list for route generation (needed for menu name matching)
  // But prioritize menus from permission modules as they have the correct structure

  // Define routes for the current module dynamically
  const generateRoutes = () => {
    // Use currentModuleMenus which comes from permissions (has name and menuId)
    return currentModuleMenus.map((menu) => {
      // Menu from permissions has: { name, menuId, actions }
      if (!menu.name) return null;

      switch (menu.name) {
        case "Role Management":
          return (
            <>
              <Route path="role_management" element={<RolesPage />} />
              <Route path="role_management/create" element={<RoleForm />} />
              <Route
                path="role_management/update/:roleId"
                element={<RoleForm />}
              />
            </>
          );
        case "User Management":
          return (
            <>
              <Route path="user_management" element={<UserPage />} />
              <Route path="user_management/create" element={<UserForm />} />
              <Route path="user_management/update/:id" element={<UserForm />} />
              {/* ✅ NEW ROUTE */}
              <Route
                path="user_management/permission/:userId"
                element={<UserPermissionWrapper />}
              />
            </>
          );
        case "Department Management":
          return (
            <>
              <Route
                path="department_management"
                element={<DepartmentPage />}
              />
              <Route
                path="department_management/create"
                element={<DepartmentForm />}
              />
              <Route
                path="department_management/update/:id"
                element={<DepartmentForm />}
              />
            </>
          );


        case "Menu Management":
          return (
            <>
              <Route path="menu_management" element={<MenuPage />} />
              <Route path="menu_management/create" element={<MenuForm />} />
              <Route path="menu_management/update/:id" element={<MenuForm />} />
            </>
          );
        case "Permission Management":
          return (
            <Route path="permission_management" element={<PermissionsPage />} />
          );
        case "Module Management":
          return (
            <>
              <Route path="module_management" element={<ModulePage />} />
              <Route path="module_management/create" element={<ModuleForm />} />
              <Route
                path="module_management/update/:id"
                element={<ModuleForm />}
              />
            </>
          );




        default:
          return null; // If no menu matches, do nothing (you can handle default behavior)
      }
    });
  };

  // Generate routes - filter out null values
  const routes = generateRoutes().filter(route => route !== null);

  // If no routes and no menus, show a message
  if (currentModuleMenus.length === 0 && !menusLoading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-100">
        <h2 className="text-xl font-semibold mb-2">No menus available</h2>
        <p className="text-sm">This module doesn't have any accessible menus.</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default route for base module path - show empty or redirect to first menu */}
      {isBasePath && (
        <Route
          path=""
          element={
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">Please select a menu from the sidebar to continue.</p>
            </div>
          }
        />
      )}

      {/* Dynamically generate module routes */}
      {routes}

      {/* Catch-all for any other route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ModuleRoutes;
