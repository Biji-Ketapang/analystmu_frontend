"use client";

import React, { useState, useMemo } from "react";

// --- TIPE DATA ---
interface DocTopic {
  doc_id: string;
  text?: string;
  topic: number;
  probability: number;
}

interface TopicSummary {
  Topic: string | number;
  CustomName?: string;
}

interface VoiceOfStudentsTableProps {
  data: DocTopic[];
  topicSummary?: TopicSummary[];
}

// --- 1. MAPPING MANUAL (Hasil Analisis Data PENS Terbaru) ---
const STATIC_TOPIC_LABELS: Record<number, string> = {
  "-1": "Promosi & Kampanye Vokasi",
  0: "Kegiatan Kampus & Kompetisi Akademik",
  1: "Prestasi Mahasiswa & Kompetisi",
  2: "Pengembangan Teknologi & Industri",
  3: "Inovasi Mahasiswa & Kegiatan Sosial",
  4: "Tugas Akademik & Ujian", 
};

// --- 2. WARNA BADGE KONSISTEN ---
const getTopicColor = (topicId: number) => {
  switch (topicId) {
    case 0: return "bg-blue-600 text-white";      // Kampus (Biru PENS Formal)
    case 1: return "bg-emerald-600 text-white";   // Prestasi (Hijau Sukses)
    case 2: return "bg-violet-600 text-white";    // Game/Creative (Ungu)
    case 3: return "bg-rose-500 text-white";      // Kesehatan/Sosial (Merah)
    case 4: return "bg-amber-500 text-white";     // Akademik (Kuning/Orange)
    case -1: return "bg-gray-500 text-white";     // Lainnya (Abu Netral)
    default: return "bg-indigo-600 text-white";
  }
};

export default function VoiceOfStudentsTable({ data = [], topicSummary = [] }: VoiceOfStudentsTableProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // --- 3. LOGIC MAPPING LABEL ---
  const topicLabelMap = useMemo(() => {
    // Mulai dengan mapping manual hasil analisis kita
    const map: Record<number, string> = { ...STATIC_TOPIC_LABELS };
    
    // Jika ada data custom dari Backend/CSV, timpa mapping manual (Optional)
    if (topicSummary && topicSummary.length > 0) {
      topicSummary.forEach((t) => {
        if (t.CustomName) {
          map[t.Topic] = t.CustomName;
        }
      });
    }
    return map;
  }, [topicSummary]);

  // --- 4. AMBIL SEMUA TOPIK UNIK UNTUK DROPDOWN ---
  const uniqueTopics = useMemo(() => {
    // Mengambil semua ID topik yang muncul di data
    const topics = new Set(data.map((d) => d.topic));
    // Mengubah ke array dan sort agar urutan rapi (-1, 0, 1, 2...)
    return Array.from(topics).sort((a, b) => a - b);
  }, [data]);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    return data.filter((doc) => {
      // Filter text (Content)
      const matchesSearch = doc.text
        ? doc.text.toLowerCase().includes(searchText.toLowerCase())
        : false;

      // Filter Dropdown
      const matchesTopic = 
        selectedTopicFilter === "all" || 
        doc.topic.toString() === selectedTopicFilter;

      return matchesSearch && matchesTopic;
    });
  }, [searchText, selectedTopicFilter, data]);

  // --- PAGINATION ---
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [page, filteredData, itemsPerPage]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const formatProbabilityBar = (prob: number) => {
    const widthPercent = Math.round(prob * 100);
    // Warna bar indikator kepercayaan model
    let barColor = "bg-emerald-500";
    if (prob < 0.6) barColor = "bg-red-400";
    else if (prob < 0.8) barColor = "bg-yellow-400";

    return (
      <div className="w-full min-w-[100px]">
        <div className="flex justify-between text-[10px] mb-1 text-gray-500">
          <span>Tingkat Keyakinan</span>
          <span className="font-bold">{widthPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${barColor}`}
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden font-sans">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Voice of Students</h3>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring percakapan mahasiswa berdasarkan topik yang terdeteksi AI.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Dropdown Filter Dinamis */}
            <select
              value={selectedTopicFilter}
              onChange={(e) => {
                setSelectedTopicFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white w-full sm:w-64 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="all">Tampilkan Semua Topik</option>
              {uniqueTopics.map((topicId) => (
                <option key={topicId} value={topicId}>
                  {topicLabelMap[topicId] || `Topik ${topicId}`}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Cari isi postingan..."
              value={searchText}
              onChange={handleSearchChange}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 shadow-sm hover:border-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-200">
              <th className="p-4 w-[250px]">Kategori Topik</th>
              <th className="p-4">Konten / Cuplikan</th>
              <th className="p-4 w-[180px]">Akurasi Model</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.doc_id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-4 align-top">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm whitespace-nowrap ${getTopicColor(row.topic)}`}
                    >
                      {topicLabelMap[row.topic] || `Topik ${row.topic}`}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-300 text-gray-800 leading-relaxed">
                      {row.text || "-"}
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    {formatProbabilityBar(row.probability)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-12 text-center text-gray-400 bg-gray-50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📭</span>
                    <p>Tidak ada data yang sesuai filter atau pencarian.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
        <div className="text-xs text-gray-500 font-medium">
          Menampilkan <span className="text-gray-900">{paginatedData.length}</span> dari <span className="text-gray-900">{filteredData.length}</span> data
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Sebelumnya
          </button>
          
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm">
            Hal. {page} / {pageCount || 1}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page === pageCount || pageCount === 0}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}