"use client";

import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import Papa from "papaparse";
import { MoreDotIcon } from "@/icons/custom-icons";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function SentimentDistribution() {
  const [isOpen, setIsOpen] = useState(false);
  const [sentimentData, setSentimentData] = useState<
    { sentiment: string; count: number; percentage: number }[]
  >([]);

  // ========== LOAD CSV DARI PUBLIC FOLDER ==========
  useEffect(() => {
    const loadCSV = async () => {
      const response = await fetch("/data/result_sentiment/sentiment_distribution.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsed = result.data.map((row: { sentiment: string; sentiment_counts: string; sentiment_percentage: string }) => ({
            sentiment: row.sentiment,
            count: Number(row.sentiment_counts),
            percentage: Number(row.sentiment_percentage),
          }));
          setSentimentData(parsed);
        },
      });
    };

    loadCSV();
  }, []);

  // Loading State
  if (sentimentData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="mt-4 h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  // Convert untuk chart
  const labels = sentimentData.map(
    (s) => `${s.sentiment} (${s.percentage}%)`
  );
  const series = sentimentData.map((s) => s.count);

  // Chart Config
  const chartOptions: ApexOptions = {
    colors: ["#465FFF", "#9CB9FF", "#FFB84D", "#FF6B6B", "#51CF66"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      toolbar: { show: false },
    },
    labels,
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: { size: "65%" },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} posts`,
      },
    },
  };
  
  

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Analisis Sentimen
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Distribusi sentimen berdasarkan hasil analisis
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)}>
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

      {/* Chart */}
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

      {/* Table */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Sentimen
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
              {sentimentData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-3 text-gray-800 dark:text-gray-300">
                    {row.sentiment}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-800 dark:text-gray-300">
                    {row.count}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-800 dark:text-gray-300 font-semibold">
                    {row.percentage}%
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
