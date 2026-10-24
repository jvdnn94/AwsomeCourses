// // src/pages/UserCourseDetail.tsx
// import { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import api from "../../utils/api";
// import { Loader2, CheckCircle, ArrowRight, Trophy, ArrowLeft } from "lucide-react";
// import type { Course, UserCourse } from "../../types/authtypes";

// const UserCourseDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState<Course | null>(null);
//   const [enrollment, setEnrollment] = useState<UserCourse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [showCongrats, setShowCongrats] = useState(false);

//   const questions = [
//     { id: 1, text: "آیا ویدیوهای آموزشی این بخش را مشاهده کرده‌اید؟" },
//     { id: 2, text: "آیا تمرینات عملی مربوطه را انجام داده‌اید؟" },
//     { id: 3, text: "آیا نکات کلیدی دوره را یادداشت کرده‌اید؟" },
//     { id: 4, text: "آیا آمادگی شرکت در آزمون نهایی را دارید؟" },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // ۱. دریافت اطلاعات دوره (این باید همیشه کار کند)
//         const courseRes = await api.get<Course>(`/courses/${id}`);
//         setCourse(courseRes.data);

//         // ۲. دریافت وضعیت ثبت‌نام با مکانیزم fallback (ضد خطا)
//         let foundEnrollment: UserCourse | null = null;
        
//         try {
//           // تلاش اول: درخواست مستقیم (اگر بک‌اند پشتیبانی کند)
//           const enrollRes = await api.get<UserCourse>(`/users/courses/${id}`);
//           foundEnrollment = enrollRes.data;
//         } catch (err) {
//           console.warn(`⚠️ اندپوینت تکی کار نکرد، در حال جستجو در لیست دوره‌های کاربر...`);
//           console.log(`خطا:${err}`);
          
//           ;
//           // تلاش دوم: دریافت لیست و پیدا کردن دوره مورد نظر (روش مطمئن داشبورد)
//           const allEnrollmentsRes = await api.get('/users/courses');
//           const rawData = allEnrollmentsRes.data;
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const enrollments: any[] = Array.isArray(rawData) 
//             ? rawData 
//             : (rawData?.data || rawData?.courses || rawData?.enrollments || []);
          
//           // پیدا کردن دوره‌ای که ID آن با ID صفحه یکی باشد
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           foundEnrollment = enrollments.find((e: any) => 
//             String(e.course_id || e.id || e.courseId) === String(id)
//           ) || null;
//         }
        
//         setEnrollment(foundEnrollment);

//       } catch (err) {
//         console.error("❌ خطا در دریافت اطلاعات دوره:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (id) fetchData();
//   }, [id]);

//    const handleProgressUpdate = async () => {
//     if (!enrollment || !id) return;
//     setUpdating(true);

//     const newProgress = Math.min(enrollment.progress_percentage + 25, 100);
//     let newStatus = enrollment.status;
    
//     if (newProgress === 100) newStatus = "completed";
//     else if (newProgress > 0) newStatus = "in_progress";

//     try {
//       // ✅ اصلاح شد: اضافه کردن /progress به انتهای آدرس تا با بک‌اند هماهنگ شود
//       await api.put(`/users/courses/${id}/progress`, {
//         progress: newProgress,
//         status: newStatus,
//       });

//       setEnrollment((prev) =>
//         prev ? { ...prev, progress_percentage: newProgress, status: newStatus } : null
//       );

//       if (newProgress === 100) {
//         setShowCongrats(true);
//       }
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : "خطای ناشناخته";
//       alert(`خطا در بروزرسانی پیشرفت: ${errorMessage}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center h-64">
//         <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
//       </div>
//     );
//   }

//   // ✅ تفکیک هوشمند خطاها: اگر خود دوره نیست، یا اگر کاربر ثبت‌نام نکرده
//   if (!course) {
//     return (
//       <div className="text-center py-16">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">دوره‌ای با این شناسه یافت نشد.</h2>
//         <Link to="/courses" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
//           <ArrowLeft size={18} /> بازگشت به لیست دوره‌ها
//         </Link>
//       </div>
//     );
//   }

//   if (!enrollment) {
//     return (
//       <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
//         <h2 className="text-xl font-bold text-gray-800 mb-2">شما در این دوره ثبت‌نام نکرده‌اید.</h2>
//         <p className="text-gray-600 mb-6">برای مشاهده چک‌لیست و پیشرفت، ابتدا باید در دوره ثبت‌نام کنید.</p>
//         <Link to="/courses" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//           ثبت‌نام در دوره‌ها
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       {/* هدر دوره */}
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.Title}</h1>
        
//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex-1">
//             <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
//               <span>وضعیت پیشرفت کلی</span>
//               <span>{enrollment.progress_percentage}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-3">
//               <div
//                 className={`h-3 rounded-full transition-all duration-700 ${
//                   enrollment.progress_percentage === 100 ? "bg-green-500" : "bg-blue-600"
//                 }`}
//                 style={{ width: `${enrollment.progress_percentage}%` }}
//               ></div>
//             </div>
//           </div>
//           <span
//             className={`px-4 py-2 rounded-full text-sm font-bold ${
//               enrollment.status === "completed"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-blue-50 text-blue-700"
//             }`}
//           >
//             {enrollment.status === "completed" ? "تکمیل شده 🎉" : "در حال یادگیری"}
//           </span>
//         </div>
//       </div>

//       {/* بخش سوالات */}
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//           <CheckCircle className="text-blue-600" />
//           چک‌لیست پیشرفت دوره
//         </h2>

//         <div className="space-y-4">
//           {questions.map((q: { id: number; text: string }) => {
//             const isAnswered = enrollment.progress_percentage >= q.id * 25;
//             const shouldBeVisible = enrollment.progress_percentage >= (q.id - 1) * 25;

//             if (!shouldBeVisible) return null;

//             return (
//               <div
//                 key={q.id}
//                 className={`p-4 rounded-xl border transition-all ${
//                   isAnswered ? "bg-green-50 border-green-200 opacity-75" : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className={`font-medium ${isAnswered ? "text-green-800" : "text-gray-700"}`}>
//                     {q.text}
//                   </span>

//                   {isAnswered ? (
//                     <span className="flex items-center gap-1 text-green-600 text-sm font-bold">
//                       <CheckCircle size={18} />
//                       تایید شده
//                     </span>
//                   ) : (
//                     <button
//                       onClick={handleProgressUpdate}
//                       disabled={updating}
//                       className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm font-medium disabled:opacity-50"
//                     >
//                       بله، انجام دادم
//                       <ArrowRight size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* پیام تبریک */}
//       {showCongrats && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
//             <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">تبریک می‌گوییم! 🎉</h2>
//             <p className="text-gray-600 mb-6">شما با موفقیت این دوره را به پایان رساندید.</p>
//             <button
//               onClick={() => {
//                 setShowCongrats(false);
//                 navigate("/dashboard");
//               }}
//               className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
//             >
//               بازگشت به داشبورد
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserCourseDetail;