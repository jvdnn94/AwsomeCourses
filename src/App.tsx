// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Dashboard from './pages/Dashboard';       // ✅ داشبورد کاربر (/dashboard)
// import AdminPanel from './pages/AdminPanel';     // پنل ادمین (/admin)
import { AuthProvider } from './context/authContext';
import LandingPage from './pages/landingPage/LandingPage';
 import ProtectedRoute from './component/ProtectedRoute';
import Navbar from './component/navbar/Navbar';
import CoursesList from './pages/courseList/CourseList';
import AuthPage from './pages/User/User';
import UserCourseDetail from './pages/CoursePage/coursePage';
import Dashboard from './pages/Dashboard/dashboard';
import AdminPanel from './pages/adminPanel/AdminPanel';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <main className="container mx-auto px-4 pb-2 pt-px">
            <Routes>
              {/* ۱. روت اصلی: صفحه خوش‌آمدگویی */}
              <Route path="/" element={<LandingPage />} />

              ۲. احراز هویت
              <Route path="/auth" element={<AuthPage />} />

              {/* ۳. لیست عمومی دوره‌ها */}
              <Route path="/courses" element={<CoursesList />} />

              {/* ۴. داشبورد کاربر (محافظت شده) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/user-courses/:id" element={<UserCourseDetail />} /> {/* ✅ مسیر جدید */}

              </Route>

              {/* ۵. پنل ادمین (محافظت شده - فقط admin) */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* ۶. ریدایرکت‌های قدیمی برای سازگاری */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/register" element={<Navigate to="/auth" replace />} />
              
              {/* ۷. صفحه ۴۰۴ یا بازگشت به خانه */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;