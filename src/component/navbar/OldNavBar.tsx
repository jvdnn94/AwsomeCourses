// // src/components/Navbar.tsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   LayoutDashboard,
//   LogOut,
//   User,
//   Shield,
//   Home,
//   Menu,
//   X,
// } from "lucide-react";
// import { useAuth } from "../../context/authContext";

// const Navbar = () => {
//   const { isAuthenticated, isAdmin, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // بستن منو هنگام back/forward مرورگر (setState داخل کال‌بک مجاز است)
//   useEffect(() => {
//     const handlePopState = () => setIsMenuOpen(false);
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   // قفل اسکرول بدنه هنگام باز بودن منو
//   useEffect(() => {
//     if (!isMenuOpen) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [isMenuOpen]);

//   const handleLogout = async () => {
//     setIsMenuOpen(false);
//     await logout();
//     navigate("/"); // بازگشت به صفحه اصلی پس از خروج
//   };

//   return (
//     <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <div className="flex items-center gap-8">
//           {/* لوگو -> لینک به صفحه اصلی */}
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
//           >
//             <BookOpen className="w-8 h-8" />
//             <span>AwesomeCourses</span>
//           </Link>

//           {/* لینک‌های ناوبری دسکتاپ */}
//           <div className="hidden lg:flex items-center gap-6">
//             <Link
//               to="/"
//               className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
//             >
//               <Home className="w-4 h-4" />
//               خانه
//             </Link>

//             <Link
//               to="/courses"
//               className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
//             >
//               <BookOpen className="w-4 h-4" />
//               دوره‌ها
//             </Link>

//             {isAuthenticated ? (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
//                 >
//                   <LayoutDashboard className="w-4 h-4" />
//                   داشبورد
//                 </Link>

//                 {isAdmin && (
//                   <Link
//                     to="/admin"
//                     className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium transition bg-purple-50 px-3 py-1 rounded-full"
//                   >
//                     <Shield className="w-4 h-4" />
//                     پنل ادمین
//                   </Link>
//                 )}
//               </>
//             ) : (
//               ""
//             )}
//           </div>
//         </div>

//         {/* بخش کاربر / ورود — دسکتاپ */}
//         <div className="hidden lg:flex">
//           {isAuthenticated ? (
//             <div className="flex items-center gap-3 border-r border-gray-300 pr-4 mr-2">
//               <span className="text-sm text-gray-600 hidden sm:block">
//                 سلام، {user?.name}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 خروج
//               </button>
//             </div>
//           ) : (
//             <Link
//               to="/auth"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-1"
//             >
//               <User className="w-4 h-4" />
//               ورود / ثبت‌نام
//             </Link>
//           )}
//         </div>

//         {/* دکمه همبرگر — موبایل و تبلت */}
//         <button
//           type="button"
//           onClick={() => setIsMenuOpen(true)}
//           aria-label="باز کردن منو"
//           aria-expanded={isMenuOpen}
//           aria-controls="mobile-menu"
//           className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
//         >
//           <Menu className="w-6 h-6" />
//         </button>
//       </div>

//       {/* ---------- منوی کشویی موبایل / تبلت ---------- */}
//       <div
//         className={`lg:hidden fixed inset-0 z-50 ${
//           isMenuOpen ? "" : "pointer-events-none"
//         }`}
//         aria-hidden={!isMenuOpen}
//       >
//         {/* اورلی */}
//         <div
//           onClick={() => setIsMenuOpen(false)}
//           className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
//             isMenuOpen ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         {/* پنل کشویی */}
//         <aside
//           id="mobile-menu"
//           role="dialog"
//           aria-modal="true"
//           className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
//             isMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           {/* هدر پنل */}
//           <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
//             <span className="flex items-center gap-2 text-xl font-bold text-blue-600">
//               <BookOpen className="w-6 h-6" />
//               AwesomeCourses
//             </span>
//             <button
//               onClick={() => setIsMenuOpen(false)}
//               aria-label="بستن منو"
//               className="p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               <X className="w-5 h-5 text-gray-700" />
//             </button>
//           </div>

//           {/* بخش کاربر / ورود — بالای لینک‌ها */}
//           <div className="px-4 py-3 border-b border-gray-200 shrink-0">
//             {isAuthenticated ? (
//               <div className="flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
//                   <User className="w-4 h-4 shrink-0" />
//                   <span className="truncate">سلام، {user?.name}</span>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition text-sm shrink-0"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   خروج
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/auth"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="w-full flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
//               >
//                 <User className="w-4 h-4" />
//                 ورود / ثبت‌نام
//               </Link>
//             )}
//           </div>

//           {/* لینک‌های ناوبری */}
//           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
//             <Link
//               to="/"
//               onClick={() => setIsMenuOpen(false)}
//               className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition"
//             >
//               <Home className="w-5 h-5" />
//               خانه
//             </Link>

//             <Link
//               to="/courses"
//               onClick={() => setIsMenuOpen(false)}
//               className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition"
//             >
//               <BookOpen className="w-5 h-5" />
//               دوره‌ها
//             </Link>

//             {isAuthenticated && (
//               <>
//                 <Link
//                   to="/dashboard"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition"
//                 >
//                   <LayoutDashboard className="w-5 h-5" />
//                   داشبورد
//                 </Link>

//                 {isAdmin && (
//                   <Link
//                     to="/admin"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium transition"
//                   >
//                     <Shield className="w-5 h-5" />
//                     پنل ادمین
//                   </Link>
//                 )}
//               </>
//             )}
//           </div>
//         </aside>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;