// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// import { TopicInsights } from "@/utils/topicProcessor";

// export default function BarTopWords({ data }: { data: TopicInsights }) {
//   const chartData = data.stackedTopWords;

//   // Jika stacked kosong atau tidak punya key topic → jangan tampilkan apa pun
//   if (!chartData || chartData.length === 0) return null;

//   // Ambil dynamic topic keys
//   const topicKeys = Object.keys(chartData[0] || {}).filter((k) =>
//     k.startsWith("t")
//   );

//   // Kalau tidak ada topic → jangan tampilkan
//   if (topicKeys.length === 0) return null;

//   const colors = [
//     "#8884d8",
//     "#82ca9d",
//     "#ffc658",
//     "#ff7f50",
//     "#8dd1e1",
//     "#a4de6c",
//     "#d0ed57",
//     "#ffa07a",
//     "#87cefa",
//     "#ba55d3",
//   ];

//   return (
//     <div className="w-full h-[500px]">
//       <h2 className="text-xl font-bold mb-2">Top Words per Topic (Stacked)</h2>

//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={chartData} layout="vertical">
//           <XAxis type="number" />
//           <YAxis dataKey="word" type="category" width={120} />
//           <Tooltip />
//           <Legend />

//           {topicKeys.map((topic, i) => (
//             <Bar
//               key={topic}
//               dataKey={topic}
//               stackId="a"
//               fill={colors[i % colors.length]}
//             />
//           ))}
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
  

// "use client";

// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { TopicInsights } from "@/utils/topicProcessor";

// export default function BarTopWords({ data }: { data: TopicInsights }) {
//   // flatten data
//   const combinedData = data.barTopWords.flatMap((topic) =>
//     topic.words.map((w) => ({
//       topic: `Topic ${topic.topic}`,
//       word: w.word,
//       score: w.score,
//     }))
//   );

//   return (
//     <div className="w-full h-[600px]">
//       <h2 className="text-xl font-bold mb-4">Top Words per Topic (Combined)</h2>

//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={combinedData} layout="vertical">
//           <XAxis type="number" />
//           <YAxis dataKey="word" type="category" width={120} />
//           <Tooltip />
//           <Bar dataKey="score" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


"use client";
import React from "react";
import { useTopicData } from "@/hooks/usePostDataTopic";
import { FiMoreVertical } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function StackedTopWords() {
  const { data, loading, error } = useTopicData();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="mt-4 h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 md:p-6">
        <p className="text-sm text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  // find all topic keys like t0, t1...
  const allKeys = new Set<string>();
  data.stackedTopWords.forEach((row) =>
    Object.keys(row).forEach((k) => {
      if (k !== "word") allKeys.add(k);
    })
  );
  const topicKeys = Array.from(allKeys).sort();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Stacked Top Words</h3>
          <p className="mt-1 text-sm text-gray-500">Perbandingan skor kata antar topik</p>
        </div>

        <div className="text-sm text-gray-500">
          {/* placeholder untuk dropdown/action */}
          <FiMoreVertical className="text-gray-400" />
        </div>
      </div>

      <div className="h-72 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.stackedTopWords} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" angle={-45} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            {topicKeys.map((k) => (
              <Bar key={k} dataKey={k} stackId="a" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
