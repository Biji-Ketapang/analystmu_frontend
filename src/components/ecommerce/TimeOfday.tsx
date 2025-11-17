// "use client";
// import React from "react";
// import { usePostData2 } from "@/hooks/usePostData2";

// export default function TimeDayHeatmap() {
//   const { data, loading, error } = usePostData2();

//   const xLabels = Array.from({ length: 24 }, (_, i) => i.toString());
//   const yLabels = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

//   if (!data || !data.timeDayHeatmap) {
//     return <div style={{ color: "red" }}>Data heatmap tidak ditemukan</div>;
//   }

//   // Flatten semua nilai untuk mencari max
//   const allValues = yLabels.flatMap(day =>
//     xLabels.map(hour => data.timeDayHeatmap[day]?.[hour] ?? 0)
//   );
//   const maxVal = Math.max(...allValues, 1);

//   return (
//     <div className="p-5 rounded-xl border bg-white dark:bg-white/5 overflow-x-auto">
//       <h3 className="text-lg font-semibold mb-3">
//         Engagement Berdasarkan Jam × Hari (Golden Time)
//       </h3>

//       <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
//         <thead>
//           <tr>
//             <th style={{ width: 70 }}></th>
//             {xLabels.map((h) => (
//               <th
//                 key={h}
//                 style={{
//                   padding: 4,
//                   border: "1px solid #eee",
//                   textAlign: "center",
//                 }}
//               >
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {yLabels.map((day) => (
//             <tr key={day}>
//               <td
//                 style={{
//                   padding: 4,
//                   border: "1px solid #eee",
//                   fontWeight: 600,
//                   background: "#fafafa",
//                 }}
//               >
//                 {day}
//               </td>

//               {xLabels.map((hour) => {
//                 const val = data.timeDayHeatmap[day]?.[hour] ?? 0;
//                 const intensity = val ? Math.min(val / maxVal, 1) : 0.05;

//                 return (
//                   <td
//                     key={hour}
//                     style={{
//                       background: `rgba(255,140,0, ${intensity})`,
//                       color: "#222",
//                       textAlign: "center",
//                       padding: 4,
//                       border: "1px solid #eee",
//                     }}
//                   >
//                     {val.toFixed(2)}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { usePostData2 } from "@/hooks/usePostData2";

export default function TimeDayHeatmap() {
  const { data, loading, error } = usePostData2();
  const [hoverIndex, setHoverIndex] = useState<{ day: string; hour: string } | null>(null);

  const xLabels = Array.from({ length: 24 }, (_, i) => i.toString());
  const yLabels = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  if (!data || !data.timeDayHeatmap) {
    return <div style={{ color: "red" }}>Data heatmap tidak ditemukan</div>;
  }

  // Mencari nilai maksimum
  const allValues = yLabels.flatMap(day =>
    xLabels.map(hour => data.timeDayHeatmap[day]?.[hour] ?? 0)
  );
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">
        Engagement Berdasarkan Jam × Hari (Golden Time)
      </h3>

      <div className="flex items-start gap-6 w-full">
        
        {/* HEATMAP */}
        <div className="flex-grow w-full">
          <table style={{ 
            borderCollapse: "collapse", 
            fontSize: 12, 
            width: "100%"   // 🔥 MELEBARKAN FULL
          }}>
            <thead>
              <tr>
                <th style={{ width: 80 }}></th>
                {xLabels.map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 4,
                      border: "1px solid #eee",
                      textAlign: "center",
                      minWidth: 32,      // 🔥 LEBAR MINIMAL
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
                      minWidth: 80,
                    }}
                  >
                    {day}
                  </td>

                  {xLabels.map((hour) => {
                    const val = data.timeDayHeatmap[day]?.[hour] ?? 0;
                    const intensity = val ? Math.min(val / maxVal, 1) : 0.05;

                    const isHovered =
                      hoverIndex?.day === day && hoverIndex?.hour === hour;

                    return (
                      <td
                        key={hour}
                        style={{
                          background: `rgba(255,140,0, ${intensity})`,
                          color: "#222",
                          textAlign: "center",
                          padding: 4,
                          border: "1px solid #eee",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onMouseEnter={() => setHoverIndex({ day, hour })}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        {/* ANGKA HANYA MUNCUL SAAT DI-HOVER */}
                        {isHovered ? (
                          <span
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              color: "#000",
                            }}
                          >
                            {val.toFixed(2)}
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LEGEND WARNA */}
        <div className="flex flex-col justify-center gap-2 text-sm">
          <div className="font-semibold">Intensity</div>

          <div className="flex flex-col gap-1">
            <LegendBox label="Low" opacity={0.15} />
            <LegendBox label="Medium" opacity={0.45} />
            <LegendBox label="High" opacity={0.75} />
            <LegendBox label="Very High" opacity={1} />
          </div>
        </div>

      </div>
    </div>
  );
}

// LEGEND COMPONENT
function LegendBox({ label, opacity }: { label: string; opacity: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 25,
          height: 25,
          background: `rgba(255,140,0, ${opacity})`,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />
      <span>{label}</span>
    </div>
  );
}
