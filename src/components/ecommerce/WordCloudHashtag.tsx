"use client";

import dynamic from "next/dynamic";
import { usePostData2 } from "@/hooks/usePostData2";

const WordCloud = dynamic(() => import("react-d3-cloud"), { ssr: false });

export default function WordCloudHashtag() {
  const { data, loading, error } = usePostData2();

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  if (!data || !data.hashtagWordCount) {
    return <div style={{ color: "red" }}>Tidak ada data hashtag</div>;
  }

  const words = Object.entries(data.hashtagWordCount)
  .slice(0, 400) // ambil 40 hashtag teratas
  .map(([text, value]) => ({ text, value }));


console.log("HASHTAG COUNT:", data.hashtagWordCount);
console.log("WORDS:", words);


  const fontSizeMapper = (word) => word.value * 8 + 16;

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5">
  <h3 className="text-lg font-semibold mb-3">Hashtag Word Cloud</h3>

  <div style={{ width: "100%", height: 350 }}>
    <WordCloud
      data={words}
      fontSizeMapper={fontSizeMapper}
      rotate={0}
      width={700}       // sesuaikan dengan tailwind container kamu
      height={270}
    />
  </div>
</div>

  );
}
