"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTopicData } from "@/hooks/usePostDataTopic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TopicProbabilityDistributionChart() {
  const { data, loading, error } = useTopicData();

  // Optimasi: Kalkulasi Histogram menggunakan useMemo
  const chartData = useMemo(() => {
    if (!data || !data.docTopicsTable) return { categories: [], seriesData: [] };

    const probabilitiesRaw = data.docTopicsTable
      .map((d) => d.probability)
      .filter((p) => typeof p === "number") as number[];

    // Bin size 0.1 (10% intervals) agar grafik lebih mudah dibaca
    const binSize = 0.1; 
    const numberOfBins = 10; 
    const bins = new Array(numberOfBins).fill(0);

    probabilitiesRaw.forEach((p) => {
      // Pastikan 1.0 masuk ke bin terakhir (index 9)
      const idx = Math.min(Math.floor(p / binSize), numberOfBins - 1);
      bins[idx]++;
    });

    const categories = bins.map((_, i) => {
      const start = Math.round(i * binSize * 100);
      const end = Math.round((i + 1) * binSize * 100);
      return `${start}% - ${end}%`;
    });

    return { categories, seriesData: bins };
  }, [data]);

  if (loading) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />;
  if (error) return <div className="text-red-500">Error loading chart</div>;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    title: {
      text: "Seberapa Yakin Model AI?",
      style: { fontSize: "16px", fontWeight: "700", color: "#1f2937" },
    },
    subtitle: {
      text: "Distribusi skor probabilitas (confidence) klasifikasi dokumen.",
      style: { fontSize: "12px", color: "#6b7280" },
    },
    colors: ["#4F46E5"], // Indigo-600
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
        dataLabels: { position: "top" }, // Show numbers on top
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toString(),
      offsetY: -20,
      style: { fontSize: "10px", colors: ["#304758"] },
    },
    xaxis: {
      categories: chartData.categories,
      title: { text: "Confidence Score (%)", style: { fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false, // Sembunyikan Y-axis karena sudah ada data label
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} Dokumen`,
        title: { formatter: () => "Jumlah:" },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <ReactApexChart 
        options={options} 
        series={[{ name: "Dokumen", data: chartData.seriesData }]} 
        type="bar" 
        height={320} 
      />
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        💡 <strong>Insight:</strong> Jika grafik condong ke kanan (80-100%), artinya model sangat yakin dengan klasifikasi topik. Jika banyak di kiri/tengah, topik mungkin ambigu.
      </div>
    </div>
  );
}