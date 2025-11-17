"use client";

import dynamic from "next/dynamic";
import { usePostData2 } from "@/hooks/usePostData2";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function groupLast12Months(trends) {
  if (!trends || trends.length === 0) return [];

  // Ambil tanggal paling baru
  const dates = trends.map(t => new Date(t.date));
  const maxDate = new Date(Math.max(...dates));

  // Ambil range 12 bulan ke belakang
  const startDate = new Date(maxDate);
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1); // set ke awal bulan

  const monthMap = {};

  trends.forEach(item => {
    const d = new Date(item.date);

    // hanya ambil data dalam 12 bulan terakhir
    if (d < startDate || d > maxDate) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + item.count;
  });

  // Urutkan bulan naik
  return Object.entries(monthMap)
    .map(([month, count]) => ({
      month,
      monthIndex: Number(month.split("-")[1]) - 1,
      count,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export default function HashtagTrendChart() {
  const { data, loading, error } = usePostData2();

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const monthly = groupLast12Months(data.hashtagTrends);

  const series = [
    {
      name: "Jumlah Hashtag",
      data: monthly.map((x) => x.count),
    },
  ];

  const options = {
    chart: { id: "hashtag-trend", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: monthly.map((x) => MONTH_NAMES[x.monthIndex]),
      title: { text: "Bulan" },
    },
    yaxis: {
      title: { text: "Jumlah Hashtag" },
    },
    markers: { size: 4 },
    grid: { borderColor: "#eee" },
    title: {
      text: "Tren Penggunaan Hashtag (12 Bulan Terakhir)",
      align: "left",
    },
    colors: ["#465FFF"],

  };

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
