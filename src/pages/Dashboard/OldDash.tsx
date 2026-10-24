// // src/pages/Dashboard.tsx
// import { useState, useEffect } from "react";
// import api from "../../utils/api";
// import CourseCard from "../../component/UI/courseCard";
// import { Loader2, GraduationCap, BookOpen } from "lucide-react";
// import type { Course, UserCourse } from "../../types/authtypes";

// const Dashboard = () => {
//   const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
//   const [coursesMap, setCoursesMap] = useState<Map<string, Course>>(new Map());
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // ۱. دریافت دوره‌های ثبت‌نام شده
//         const enrollmentsRes = await api.get("/users/courses");
//         const rawData = enrollmentsRes.data;
//         let enrollments: UserCourse[] = [];

//         if (Array.isArray(rawData)) {
//           enrollments = rawData;
//         } else if (rawData && typeof rawData === "object") {
//           enrollments =
//             rawData.data ||
//             rawData.courses ||
//             rawData.enrollments ||
//             rawData.userCourses ||
//             [];
//         }
//         setUserCourses(enrollments);

//         // ۲. دریافت اطلاعات تمام دوره‌ها برای Merge کردن
//         const coursesRes = await api.get<Course[]>("/courses");
//         const map = new Map<string, Course>();

//         if (Array.isArray(coursesRes.data)) {
//           coursesRes.data.forEach((c: Course) => {
//             map.set(String(c.id), c);
//           });
//         }
//         setCoursesMap(map);

//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (err: any) {
//         console.error("❌ خطا در دریافت اطلاعات داشبورد:", err);
//         setError(err.response?.data?.message || "خطا در دریافت اطلاعات");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center h-64">
//         <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="text-center text-red-600 p-4 bg-red-50 rounded-xl">
//         {error}
//       </div>
//     );

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center gap-4 mb-8">
//         <div className="p-4 bg-blue-100 rounded-full">
//           <GraduationCap className="w-8 h-8 text-blue-600" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             داشبورد یادگیری من
//           </h1>
//           <p className="text-gray-600">مسیر پیشرفت شما در دوره‌های آموزشی</p>
//         </div>
//       </div>

//       {userCourses.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
//           <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">
//             هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {userCourses.map((enrollment, index) => {
//             // استخراج ایمن شناسه با چندین لایه fallback
//             const rawId =
//               enrollment.course_id ||
//               // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               (enrollment as any).id ||
//               // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               (enrollment as any).courseId;
//             const courseIdStr = String(rawId || `fallback-${index}`); // تضمین می‌کنیم هرگز undefined نباشد

//             const course = coursesMap.get(courseIdStr);

//             if (!course) {
//               return (
//                 <div
//                   key={courseIdStr}
//                   className="bg-white p-6 rounded-xl border border-red-200 shadow-sm"
//                 >
//                   <p className="text-red-600 font-bold">
//                     دوره با شناسه {courseIdStr} یافت نشد.
//                   </p>
//                 </div>
//               );
//             }

//             return <CourseCard course={course} enrollment={enrollment} />;
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
