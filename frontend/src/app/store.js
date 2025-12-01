// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import permissionReducer from "../features/permissions/permissionSlice";
import rolesReducer from "../features/Roles/rolesSlice";
import roleFormReducer from "../features/Roles/roleFormSlice";
import menuReducer from "../features/menus/menuSlice";
import modulesReducer from "../features/Modules/ModuleSlice";
import userReducer from "../features/users/userSlice";
import departmentReducer from "../features/department/departmentSlice";
import userPermissionReducer from "../features/UserPermission/userPermissionSlice";

const rootReducer = combineReducers({
  permission: permissionReducer,
  userPermission: userPermissionReducer,
  roles: rolesReducer,
  roleForm: roleFormReducer,
  menus: menuReducer,
  modules: modulesReducer,
  users: userReducer,
  department: departmentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "userPermission",
    "permission",
    "roles",
    "menus",
    "modules",
    "users",
    "department",
  ], // ✅ roleForm jaise forms ka temporary state store nahi karte mostly
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: {
    trace: false,
    shouldRecordChanges: false, // 🔥 redux devtools ko snapshots record karne se rokta hai
  },
});

export const persistor = persistStore(store);
