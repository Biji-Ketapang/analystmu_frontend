"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { FiMoreVertical } from "react-icons/fi";

interface PostData {
  caption: string;
  sentiment_label: string;
  like_count: number;
  comment_count: number;
  engagement_rate: number;
}

export default function TopEngagementPostsCSV() {
  const [rawData, setRawData] = useState<PostData[]>([]);
  const [filtered, setFiltered] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  // ⭐ State untuk expand caption
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // =========================
  // LOAD CSV
  // =========================
  useEffect(() => {
    const loadCSV = async () => {
      const response = await fetch(
        "/data/result_sentiment/top_3_engagement_by_sentiment.csv"
      );
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsed: PostData[] = result.data.map((row: { caption: string; sentiment_label: string; like_count: string; comment_count: string; engagement_rate: string }) => ({
            caption: row.caption,
            sentiment_label: row.sentiment_label,
            like_count: Number(row.like_count),
            comment_count: Number(row.comment_count),
            engagement_rate: Number(row.engagement_rate),
          }));

          setRawData(parsed);
          setLoading(false);
        },
      });
    };

    loadCSV();
  }, []);

  // =========================
  // FILTER SENTIMENT
  // =========================
  useEffect(() => {
    let data = [...rawData];

    if (filter !== "all") {
      // Jika pilih sentiment tertentu → tampilkan semua
      data = data.filter((d) => d.sentiment_label === filter);
    } else {
      // Jika ALL → ambil top 3 overall
      data = data
        .sort(
          (a, b) =>
            b.like_count +
            b.comment_count -
            (a.like_count + a.comment_count)
        )
        .slice(0, 3);
    }

    setFiltered(data);
  }, [filter, rawData]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Postingan berdasarkan Sentimen dan Engagement
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sorted by likes + comments (Top 3)
          </p>
        </div>

        {/* DROPDOWN SENTIMENT */}
        <div className="relative inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="dropdown-toggle"
          >
            <FiMoreVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            {["all", "positive", "neutral", "negative"].map((sent) => (
              <DropdownItem
                key={sent}
                onItemClick={() => {
                  setFilter(sent);
                  setIsOpen(false);
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 capitalize"
              >
                {sent}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* LIST TOP POST */}
      <div className="space-y-4 py-6">
        {filtered.map((post, idx) => (
          <div
            key={idx}
            onClick={() =>
              setExpandedIndex(expandedIndex === idx ? null : idx)
            }
            className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 font-semibold text-blue-600 dark:text-blue-400 text-xs">
                    #{idx + 1}
                  </span>

                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                    {post.sentiment_label}
                  </span>
                </div>

                {/* CAPTION */}
                <p
                  className={`text-sm text-gray-700 dark:text-gray-300 ${
                    expandedIndex === idx ? "" : "line-clamp-2"
                  }`}
                >
                  {post.caption}
                </p>
              </div>

              {/* LIKE + COMMENT */}
              <div className="flex flex-col gap-2 text-right">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  👍 {post.like_count}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  💬 {post.comment_count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
