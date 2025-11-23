"use client";
import React from "react";
import dynamic from "next/dynamic";
import { FiMoreVertical } from "react-icons/fi";
import { useTopicData } from "@/hooks/usePostDataTopic";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TopicDistributionBar() {
  const { data, loading, error } = useTopicData();
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => setIsOpen(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="mt-4 h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  /* =========================================================
      1. Format List Topik + Count
  ========================================================= */
  const topicList = data.donutDistribution.map((d, index) => ({
    no: index + 1,
    name: d.topicName,
    count: d.count,
    desc:
      d.summary ||
      `Topik ${d.topicName} memiliki total ${d.count} dokumen yang membahas terkait aktivitas tersebut.`,
  }));

  /* =========================================================
      2. Bar Chart Data (X-axis = Topic 1, Topic 2, ...)
  ========================================================= */
  const barCategories = topicList.map((t) => `Topic ${t.no}`);
  const barValues = topicList.map((t) => t.count);

  // simpan nama asli untuk tooltip
  const originalNames = topicList.map((t) => t.name);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      type: "bar",
      height: 260,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories: barCategories,
      labels: { rotate: 0, style: { fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: undefined },
    },
    dataLabels: { enabled: false },

    /* Tooltip menampilkan nama asli topik + jumlah dokumen */
    tooltip: {
      custom: ({ dataPointIndex, w }) => {
        const count = w.globals.series[0][dataPointIndex];
        const trueName = originalNames[dataPointIndex];

        return `
          <div style="padding:8px;">
            <strong>${trueName}</strong><br/>
            ${count} dokumen
          </div>
        `;
      },
    },

    grid: {
      yaxis: { lines: { show: true } },
    },
  };

  const series = [
    {
      name: "Jumlah Dokumen",
      data: barValues,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Topic Distribution
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Persebaran jumlah dokumen berdasarkan topik
          </p>
        </div>

      </div>

      {/* LIST TOPIK */}
      <div className="mt-4 space-y-4">
        {topicList.map((t) => (
          <div key={t.no} className="border-b border-gray-200 pb-3">
            <p className="font-semibold text-gray-800">
              {t.no}. {t.name}
            </p>
            <p className="text-sm text-gray-600">Jumlah dokumen: {t.count}</p>
            <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div className="mt-6">
        <ReactApexChart options={options} series={series} type="bar" height={260} />
      </div>
    </div>
  );
}
