"use client";
import React from "react";
import { usePostData } from "@/hooks/usePostData";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function TopEngagementPosts() {
  const { data, loading, error } = usePostData();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 md:p-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error loading data: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top 3 Postingan dengan Engagement Tertinggi
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Berdasarkan jumlah likes dan comments
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
            <FiMoreVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="space-y-4 py-6">
        {data.topPosts.map((post, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 font-semibold text-blue-600 dark:text-blue-400 text-xs">
                    #{idx + 1}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {post.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {post.caption}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {post.date}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  👍 {post.likes}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  💬 {post.comments}
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Engagement: {post.engagement}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Likes
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
              {data.topPosts.reduce((sum, p) => sum + p.likes, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Comments
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
              {data.topPosts.reduce((sum, p) => sum + p.comments, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Engagement
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-white/90">
              {data.topPosts.reduce((sum, p) => sum + p.engagement, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
