"use client";
import React from "react";
import { usePostData2 } from "@/hooks/usePostData2";

export default function TimeDayHeatmap() {
  const { data, loading, error } = usePostData2();

  const xLabels = Array.from({ length: 24 }, (_, i) => i.toString());
  const yLabels = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  if (!data || !data.timeDayHeatmap) {
    return <div style={{ color: "red" }}>Data heatmap tidak ditemukan</div>;
  }

  // Flatten semua nilai untuk mencari max
  const allValues = yLabels.flatMap(day =>
    xLabels.map(hour => data.timeDayHeatmap[day]?.[hour] ?? 0)
  );
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">
        Engagement Berdasarkan Jam × Hari (Golden Time)
      </h3>

      <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ width: 70 }}></th>
            {xLabels.map((h) => (
              <th
                key={h}
                style={{
                  padding: 4,
                  border: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {yLabels.map((day) => (
            <tr key={day}>
              <td
                style={{
                  padding: 4,
                  border: "1px solid #eee",
                  fontWeight: 600,
                  background: "#fafafa",
                }}
              >
                {day}
              </td>

              {xLabels.map((hour) => {
                const val = data.timeDayHeatmap[day]?.[hour] ?? 0;
                const intensity = val ? Math.min(val / maxVal, 1) : 0.05;

                return (
                  <td
                    key={hour}
                    style={{
                      background: `rgba(255,140,0, ${intensity})`,
                      color: "#222",
                      textAlign: "center",
                      padding: 4,
                      border: "1px solid #eee",
                    }}
                  >
                    {val.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
