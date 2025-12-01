import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/DashboardPage"; // ✅
import ModuleLayout from "./pages/ModuleLayout"; // ✅
import PrivateRoute from "./components/auth/privateRoute.jsx"; // ✅
import { AuthProvider } from "./context/AuthContext"; // ✅
import LoginPage from "./pages/LoginPage"; // ✅
import GlobalNotFound from "./components/common/GlobalNotFound.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import { ThemeProvider } from "./context/ThemeContext";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />


            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/module/:moduleName/*"
              element={
                <PrivateRoute>
                  <ModuleLayout />
                </PrivateRoute>
              }
            />

            {/* 🔴 Catch-All Global Fallback */}
            <Route path="*" element={<GlobalNotFound />} />
          </Routes>

          {/* ToastContainer is placed here to display notifications globally */}
          <ToastContainer position="top-center" autoClose={800} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
