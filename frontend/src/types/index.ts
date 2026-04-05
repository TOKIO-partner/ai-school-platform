export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "admin" | "corp_admin" | "instructor" | "student";
  plan: "free" | "pro" | "business";
  avatar: string | null;
  bio: string;
  is_active: boolean;
  organization_name: string;
  date_joined: string;
  last_login: string | null;
}

export interface Organization {
  id: number;
  name: string;
  plan: string;
  max_seats: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  description: string;
  overview?: string;
  thumbnail: string | null;
  instructor: number;
  instructor_name: string;
  status: "draft" | "published" | "hidden";
  duration_hours: number;
  tags: string[];
  language?: string;
  lesson_count: number;
  enrolled_count: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  order: number;
  duration_label: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  duration_label: string;
  order: number;
  lesson_type: "video" | "article" | "quiz" | "exercise";
}

export interface Enrollment {
  id: number;
  course: Course;
  progress_percent: number;
  created_at: string;
}

export interface LessonProgress {
  id: number;
  lesson: number;
  lesson_title?: string;
  is_completed: boolean;
  watch_time_seconds: number;
}

export interface SkillPoint {
  category: string;
  points: number;
  level: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  id: number;
  badge: Badge;
  earned_at: string;
}

export interface CommunityPost {
  id: number;
  user: User;
  channel: string;
  title: string;
  content: string;
  tags: string[];
  reactions_count: number;
  comments_count: number;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  type: string;
  description: string;
  date: string;
  max_participants: number;
  registered_count: number;
  is_registered: boolean;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Subscription {
  id: number;
  plan: string;
  status: string;
  current_period_end: string;
}

// API response types

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface StudentStats {
  total_watch_time_seconds: number;
  total_watch_time_hours: number;
  completed_courses: number;
  completed_lessons: number;
  skill_points_total: number;
  weekly_completed_lessons: number;
}

export interface AdminDashboardData {
  total_users: number;
  monthly_revenue: number;
  avg_completion_rate: number;
  ai_usage_count: number;
  revenue_chart: { month: string; revenue: number }[];
  user_growth_chart: { month: string; individual: number; corporate: number }[];
  recent_activities: { name: string; action: string; detail: string; time: string }[];
}

export interface AdminBillingOverview {
  monthly_revenue: number;
  mrr: number;
  churn_rate: number;
  arpu: number;
  monthly_chart: { month: string; revenue: number }[];
  plan_breakdown: { plan: string; count: number }[];
}

export interface PaymentRecord {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  amount: number;
  plan: string;
  method: string;
  status: "success" | "failed" | "refunded";
  created_at: string;
}

export interface RefundRequestRecord {
  id: number;
  payment: PaymentRecord;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

// AI Coach types

export interface AIChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface AILessonComment {
  time_label: string;
  text: string;
}
