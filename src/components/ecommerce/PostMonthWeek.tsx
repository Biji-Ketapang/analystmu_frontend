
"use client";
import React from "react";
import { usePostData2 } from "@/hooks/usePostData2";

export default function PostMonthWeek() {
  const { data, loading, error } = usePostData2();
  const xLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const yLabels = ["Week 1","Week 2","Week 3","Week 4"];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (!data || !Array.isArray(data.postHeatmap) || !data.postHeatmap.length) {
    return <div style={{color:'red'}}>Data heatmap tidak valid atau kosong</div>;
  }

  // Cari nilai maksimum untuk normalisasi warna
  const maxVal = Math.max(...data.postHeatmap.flat(), 1);

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5">
      <h3 className="text-lg font-semibold">📌 Aktivitas Posting per Minggu vs Bulan</h3>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th></th>
            {xLabels.map((label, idx) => (
              <th key={idx} style={{padding: 4, border: '1px solid #eee'}}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yLabels.map((week, i) => (
            <tr key={i}>
              <td style={{padding: 4, border: '1px solid #eee'}}>{week}</td>
              {data.postHeatmap[i].map((val, j) => (
                <td key={j} style={{
                  background: `rgba(70,95,255,${val ? Math.min(val/maxVal,1) : 0.05})`,
                  color: '#222',
                  textAlign: 'center',
                  padding: 4,
                  border: '1px solid #eee'
                }}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
