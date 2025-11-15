"use client";
import React from "react";
import { usePostData2 } from "@/hooks/usePostData2";
import dynamic from "next/dynamic";

const HeatMap = dynamic(() => import("react-heatmap-grid"), { ssr: false });

export default function PostMonthWeek() {
  const { data, loading } = usePostData2();
  if (loading || !data) return "Loading...";

  const xLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const yLabels = ["Week 1","Week 2","Week 3","Week 4"];

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5">
      <h3 className="text-lg font-semibold">📌 Aktivitas Posting per Minggu vs Bulan</h3>
      <HeatMap 
        xLabels={xLabels}
        yLabels={yLabels}
        data={data.postHeatmap}
      />
    </div>
  );
}
