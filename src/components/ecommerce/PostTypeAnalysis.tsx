"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { usePostData } from "@/hooks/usePostData";
import { MoreDotIcon } from "@/icons/custom-icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PostTypeAnalysis() {
  const { data, loading, error } = usePostData();
  const [isOpen, setIsOpen] = useState(false);

  // Gabungkan semua tipe 'Image' dan 'Video', serta ambil 'Carousel'
  const filteredStats: { type: string; count: number; percentage: number }[] = [];
  if (data) {
    let imageCount = 0;
    let imagePercentage = 0;
    let videoCount = 0;
    let videoPercentage = 0;
  const carouselStat = data.postTypeStats.find(s => s.type.toLowerCase() === 'carousel');
    data.postTypeStats.forEach(s => {
      if (s.type.toLowerCase().includes('image')) {
        imageCount += s.count;
        imagePercentage += s.percentage;
      }
      if (s.type.toLowerCase().includes('video')) {
        videoCount += s.count;
        videoPercentage += s.percentage;
      }
    });
    if (imageCount > 0) {
      filteredStats.push({ type: 'Image', count: imageCount, percentage: Math.round(imagePercentage * 100) / 100 });
    }
    if (carouselStat) {
      filteredStats.push(carouselStat);
    }
    if (videoCount > 0) {
      filteredStats.push({ type: 'Video', count: videoCount, percentage: Math.round(videoPercentage * 100) / 100 });
    }
  }

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
    colors: ["#465FFF", "#9CB9FF", "#FFB84D", "#FF6B6B", "#51CF66"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      toolbar: {
        show: false,
      },
    },
  labels: filteredStats.map(s => `${s.type} (${s.percentage}%)`),
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} posts`,
      },
    },
  };

  const series = filteredStats.map(s => s.count);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Analisis Jenis Postingan
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Distribusi berdasarkan tipe postingan
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

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2 py-6">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="donut"
            height={320}
          />
        </div>
      </div>

      {/* Stats Table */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Tipe Postingan
                </th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Jumlah
                </th>
                <th className="px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-3 text-gray-800 dark:text-gray-300">
                    {stat.type}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-800 dark:text-gray-300">
                    {stat.count}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-800 dark:text-gray-300 font-semibold">
                    {stat.percentage}%
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
