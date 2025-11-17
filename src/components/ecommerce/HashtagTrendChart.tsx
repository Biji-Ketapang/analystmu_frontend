"use client";

import dynamic from "next/dynamic";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { ApexOptions } from "apexcharts";
// Asumsi hook ini mengembalikan data yang memiliki properti 'hashtagTrends'
// dengan struktur [{ date: string, count: number }]
import { usePostData2 } from "@/hooks/usePostData2"; 

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * Mengelompokkan data tren berdasarkan bulan dan memfilter 12 bulan terakhir.
 * @param {Array<{date: string, count: number}>} trends - Data tren dari API.
 * @returns {Array<{month: string, monthIndex: number, count: number}>} - Data bulanan yang sudah diurutkan.
 */
function groupLast12Months(trends) {
  if (!trends || trends.length === 0) return [];

  // 1. Cari tanggal paling baru (maxDate)
  const dates = trends.map(t => new Date(t.date));
  const maxDate = new Date(Math.max(...dates));

  // 2. Tentukan tanggal awal range 12 bulan ke belakang
  const startDate = new Date(maxDate);
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1); // Set ke awal bulan untuk perhitungan yang tepat

  const monthMap = {};

  trends.forEach(item => {
    const d = new Date(item.date);

    // hanya ambil data dalam 12 bulan terakhir
    if (d < startDate || d > maxDate) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + item.count;
  });

  // 3. Urutkan bulan naik
  return Object.entries(monthMap)
    .map(([month, count]) => ({
      month,
      monthIndex: Number(month.split("-")[1]) - 1,
      count,
    }))
    // PERBAIKAN: Menggunakan .getTime() untuk mengonversi Date menjadi number (timestamp) 
    // agar memenuhi persyaratan Type Checker TypeScript untuk operasi aritmatika.
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export default function HashtagTrendChart() {
  const { data, loading, error } = usePostData2();

  if (loading) return <SkeletonLoader height={350} />;
  
  // Menampilkan pesan error dengan styling jika ada
  if (error) return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 text-red-600">
      Error fetching data: {error}
    </div>
  );

  // Pastikan data dan hashtagTrends ada sebelum diproses
  const monthly = groupLast12Months(data?.hashtagTrends);

  const series = [
    {
      name: "Jumlah Hashtag",
      data: monthly.map((x) => x.count as number),
    },
  ];

  const options: ApexOptions = {
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
    <div className="p-5 rounded-xl border bg-white shadow-lg dark:bg-gray-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}