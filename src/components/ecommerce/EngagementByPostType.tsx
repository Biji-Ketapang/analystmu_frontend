"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { usePostData } from "@/hooks/usePostData";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function EngagementByPostType() {
  const { data, loading, error } = usePostData();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="mt-4 h-64 bg-gray-200 rounded dark:bg-gray-700" />
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

  const chartOptions: ApexOptions = {
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.postTypeEngagement.map(e => e.type),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Average Engagement",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
    {
      name: "Avg Likes",
      data: data.postTypeEngagement.map(e => e.avgLikes),
    },
    {
      name: "Avg Comments",
      data: data.postTypeEngagement.map(e => e.avgComments),
    },
  ];

  // Highest engagement type
  const highestEngagement = data.postTypeEngagement[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Engagement per Jenis Postingan
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Rata-rata likes dan comments
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
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

      {/* Highest Engagement Highlight */}
      {highestEngagement && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jenis postingan dengan engagement tertinggi:
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            {highestEngagement.type}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Rata-rata engagement: <span className="font-semibold">{highestEngagement.avgEngagement}</span> per post
          </p>
        </div>
      )}

      <div className="max-w-full overflow-x-auto custom-scrollbar py-6">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Tipe Postingan
                </th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Avg Likes
                </th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Avg Comments
                </th>
                <th className="px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Total Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              {data.postTypeEngagement.map((engagement, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-3 text-gray-800 dark:text-gray-300">
                    {engagement.type}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-800 dark:text-gray-300">
                    {engagement.avgLikes}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-800 dark:text-gray-300">
                    {engagement.avgComments}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-800 dark:text-gray-300 font-semibold">
                    {engagement.avgEngagement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
