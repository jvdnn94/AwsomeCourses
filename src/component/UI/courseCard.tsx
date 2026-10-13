// src/components/CourseCard.tsx
import { Link } from 'react-router-dom';

import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { Course, UserCourse } from '../../types/authtypes';

interface CourseCardProps {
  course: Course;
  enrollment: UserCourse;
}

const CourseCard = ({ course, enrollment }: CourseCardProps) => {
  const statusColor = 
    enrollment.status === 'completed' ? 'text-green-600 bg-green-50 border-green-200' :
    enrollment.status === 'in_progress' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
    'text-gray-600 bg-gray-50 border-gray-200';

  const StatusIcon = 
    enrollment.status === 'completed' ? CheckCircle :
    enrollment.status === 'in_progress' ? TrendingUp : Clock;

  return (
    <Link 
      to={`/user-courses/${course.id}`}
      className="block group"
    >
      <div className={`h-full p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${statusColor}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/80">
            <StatusIcon size={14} />
            {enrollment.status === 'completed' ? 'تکمیل شده' : 
             enrollment.status === 'in_progress' ? 'در حال انجام' : 'شروع نشده'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {course.Title}
        </h3>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>پیشرفت شما</span>
            <span>{enrollment.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                enrollment.progress_percentage >= 100 ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${enrollment.progress_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;