// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";

import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // بازگشت به صفحه اصلی پس از خروج
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          {/* لوگو -> لینک به صفحه اصلی */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <BookOpen className="w-8 h-8" />
            <span>AwesomeCourses</span>
          </Link>
          {/* لینک خانه */}
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
          >
            <Home className="w-4 h-4" />
            خانه
          </Link>

          {/* لینک دوره‌ها */}
          <Link
            to="/courses"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
          >
            <BookOpen className="w-4 h-4" />
            دوره‌ها
          </Link>

          {isAuthenticated ? (
            <>
              {/* لینک داشبورد */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                داشبورد
              </Link>

              {/* لینک ادمین */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium transition bg-purple-50 px-3 py-1 rounded-full"
                >
                  <Shield className="w-4 h-4" />
                  پنل ادمین
                </Link>
              )}
            </>
          ) : (
            ""
          )}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 border-r border-gray-300 pr-4 mr-2">
            <span className="text-sm text-gray-600 hidden sm:block">
              سلام، {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1"
          >
            <User className="w-4 h-4" />
            ورود / ثبت‌نام
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
