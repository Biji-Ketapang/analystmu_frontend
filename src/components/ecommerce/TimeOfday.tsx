"use client";
import React from "react";
import dynamic from "next/dynamic";
import { usePostData2 } from "@/hooks/usePostData2";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TimeOfDayChart() {
  const { data, loading } = usePostData2();
  if (loading || !data) return "Loading...";

  const series = [
    data.timeOfDayEngagement.morning,
    data.timeOfDayEngagement.afternoon,
    data.timeOfDayEngagement.evening,
  ];

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5">
      <h3 className="text-lg font-semibold">⏰ Engagement Berdasarkan Time of Day</h3>
      <Chart 
        type="pie"
        series={series}
        options={{
          labels: ["Morning", "Afternoon", "Evening"],
          legend: { position: "bottom" },
        }}
      />
    </div>
  );
}
