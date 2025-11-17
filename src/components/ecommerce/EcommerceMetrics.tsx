"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { FaRegHeart, FaUsers, FaArrowUp, FaImages, FaRegComment } from "react-icons/fa";
import { usePostData } from "@/hooks/usePostData";

export const EcommerceMetrics = () => {
  const { data, loading, error } = usePostData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="mt-5 h-4 w-24 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="mt-2 h-6 w-32 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 md:p-6">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading data: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 md:grid-cols-4">
      {/* <!-- Total Postingan --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          <FaImages className="text-blue-600 dark:text-blue-400" size={32} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Postingan
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalPosts.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* <!-- Rata-rata Like --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl dark:bg-pink-900/30">
          <FaRegHeart className="text-pink-600 dark:text-pink-400" size={32} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rata-rata Like
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.avgLikes}
            </h4>
          </div>
          <Badge color="success">
            <FaArrowUp className="inline mr-1" />
            Per Post
          </Badge>
        </div>
      </div>

      {/* <!-- Rata-rata Komentar --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          <FaRegComment className="text-green-600 dark:text-green-400" size={32} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rata-rata Komentar
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.avgComments}
            </h4>
          </div>
          <Badge color="success">
            Per Post
          </Badge>
        </div>
      </div>

      {/* <!-- Total Followers --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
          <FaUsers className="text-purple-600 dark:text-purple-400" size={32} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Followers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalFollowers?.toLocaleString?.() ?? "--"}
            </h4>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Data belum tersedia
          </span>
        </div>
      </div>
    </div>
  );
};
