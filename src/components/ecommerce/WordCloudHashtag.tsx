"use client";

import React, { useState, useEffect } from 'react';
import { Text } from '@visx/text';
import { Wordcloud } from '@visx/wordcloud';
import { scaleLog } from '@visx/scale';
import { usePostData2 } from "@/hooks/usePostData2";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function WordCloudHashtag() {
  const { data, loading, error } = usePostData2();
  const [isMounted, setIsMounted] = useState(false);

  // Fix Hydration Error: Pastikan render hanya terjadi di client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading) return <SkeletonLoader height={350} />;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  if (!data || !data.hashtagWordCount) {
    return <div className="text-gray-500">Data tidak tersedia</div>;
  }

  // Transform Data
  const words = Object.entries(data.hashtagWordCount)
    .slice(0, 600)
    .map(([text, value]) => ({ text, value: value as number }));

  // Skema Warna Manual
  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#0891b2"];

  // Setup Skala Font (Logarithmic agar perbedaan kecil tetap terlihat)
  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [15, 60], // Ukuran font min 15px, max 60px
  });

  type WordDatum = {
    text: string;
    value: number;
    x?: number;
    y?: number;
    rotate?: number;
    size?: number;
    font?: string;
  };

  const fontSizeSetter = (datum: WordDatum) => fontScale(datum.value);

  if (!isMounted) return null;

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 w-full transition-all duration-300 hover:scale-[1.03] hover:shadow-xl">
      <h3 className="text-lg font-semibold mb-3">Hashtag Word Cloud (VisX)</h3>
      
      <div className="w-full h-[350px] flex justify-center items-center">
        <Wordcloud
          words={words}
          width={800}
          height={350}
          fontSize={fontSizeSetter}
          font={'Poppins'}
          padding={2}
          spiral="archimedean"
          rotate={0} // 0 derajat agar horizontal semua
          random={() => 0.5} // Agar posisi konsisten (tidak acak tiap render)
        >
          {(cloudWords) =>
            cloudWords.map((w: WordDatum, i: number) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      </div>
    </div>
  );
}