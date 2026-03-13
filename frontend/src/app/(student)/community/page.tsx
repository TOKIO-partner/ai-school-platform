"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hash,
  Bell,
  MessageCircle,
  Award,
  MessageSquare,
  ThumbsUp,
  MoreHorizontal,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Channel = {
  id: string;
  label: string;
  icon: React.ElementType;
};

type Tag = {
  id: string;
  label: string;
};

type Post = {
  id: number;
  authorInitials: string;
  authorName: string;
  badge: string;
  timeAgo: string;
  channel: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
};

type UpcomingEvent = {
  id: number;
  type: string;
  time: string;
  title: string;
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const channels: Channel[] = [
  { id: "all", label: "すべての投稿", icon: Hash },
  { id: "announcements", label: "お知らせ", icon: Bell },
  { id: "questions", label: "質問・相談", icon: MessageCircle },
  { id: "showcase", label: "作品公開", icon: Award },
  { id: "casual", label: "雑談", icon: MessageSquare },
];

const trendingTags: Tag[] = [
  { id: "nextjs", label: "#Nextjs" },
  { id: "figma", label: "#Figma" },
  { id: "career", label: "#Career" },
  { id: "ai", label: "#AI" },
];

const posts: Post[] = [
  {
    id: 1,
    authorInitials: "TS",
    authorName: "田中 翔",
    badge: "Student",
    timeAgo: "2時間前",
    channel: "#questions",
    title: "Next.jsのApp Routerでのメタデータ設定について",
    body: "動的なOGP画像を生成したいのですが、generateMetadata関数内で非同期処理を行う際のベストプラクティスを教えてください。",
    tags: ["#Next.js", "#React"],
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    authorInitials: "YM",
    authorName: "山田 美咲",
    badge: "Mentor",
    timeAgo: "5時間前",
    channel: "#showcase",
    title: "Figmaで作ったポートフォリオサイトのデザイン共有",
    body: "先月から取り組んでいたポートフォリオサイトがようやく完成しました！フィードバックいただけると嬉しいです。",
    tags: ["#Figma", "#Design"],
    likes: 24,
    comments: 8,
  },
  {
    id: 3,
    authorInitials: "KS",
    authorName: "佐藤 健一",
    badge: "Student",
    timeAgo: "1日前",
    channel: "#casual",
    title: "AIツールのおすすめ教えてください",
    body: "最近話題のAIツールが多すぎて追いきれません。皆さんが実際に使っていておすすめのものがあれば教えてください！",
    tags: ["#AI", "#Tools"],
    likes: 18,
    comments: 15,
  },
];

const upcomingEvents: UpcomingEvent[] = [
  { id: 1, type: "Live", time: "明日 19:00", title: "AIデザインワークショップ" },
  { id: 2, type: "Meetup", time: "土曜日 14:00", title: "もくもく会 #24" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState("all");

  return (
    <div className="flex h-full gap-6">
      {/* Channels Sidebar */}
      <div className="w-64 shrink-0 hidden md:flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-full">
          <h3 className="font-bold text-slate-800 px-2 mb-2">Channels</h3>
          <div className="space-y-1">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isActive = activeChannel === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-fuchsia-50 text-fuchsia-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {channel.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-slate-800 px-2 mb-2">Trending Tags</h3>
            <div className="flex flex-wrap gap-2 px-2">
              {trendingTags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">コミュニティ</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span>+ 新しい投稿を作成</span>
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                  {post.authorInitials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{post.authorName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-50 text-slate-500 border-slate-200">
                      {post.badge}
                    </span>
                    <span className="text-xs text-slate-400">• {post.timeAgo}</span>
                    <span className="text-xs text-slate-400">• {post.channel}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 cursor-pointer hover:text-cyan-600">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{post.body}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-fuchsia-600 text-sm">
                      <ThumbsUp className="w-4 h-4" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-600 text-sm">
                      <MessageSquare className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="ml-auto text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar (Events) */}
      <div className="w-72 shrink-0 hidden xl:block">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm sticky top-4">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded">
                    {event.type}
                  </span>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                <h4 className="font-bold text-slate-700 text-sm">{event.title}</h4>
              </div>
            ))}
          </div>
          <Link
            href="/events"
            className="block w-full mt-4 py-2 text-sm text-center text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50"
          >
            カレンダーを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
