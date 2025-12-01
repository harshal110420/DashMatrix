import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../features/permissions/permissionSlice";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import ProfileIcon from "../components/common/ProfileIcon";
import { fetchPermissionsByUser } from "../features/UserPermission/userPermissionSlice";


const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  console.log("user:", user)
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPermissionsByUser(user.id));
    }
  }, [user, dispatch]);

  const { selectedUserPermissions: modules, loading } = useSelector(
    (state) => state.userPermission
  );
  console.log("selected user permission:", modules)
  if (!user) return null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // 👇 Module filtering based on 'view' permission
  const visibleModules = modules.filter((module) => {
    const menus = module.menus;
    if (!menus) return false;

    // Flatten all menus (Master, Transaction, Report)
    const allMenus = Object.values(menus).flat();

    // Check if at least one menu has 'view' action
    return allMenus.some((menu) => menu.actions?.includes("view"));
  });

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Navbar */}

      <nav className="bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">Talent Gate</div>
        <ProfileIcon />
      </nav>




      {/* Dashboard Content */}
      <div className="p-6 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user.username}!</h1>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleModules.map((module) => (
              <Link
                key={module.modulePath}
                to={`/module/${module.modulePath}`}
                className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-xl hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {module.moduleName} Module
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
