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
  thumbnail: string | null;
  instructor: User;
  status: "draft" | "published" | "hidden";
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  order: number;
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
