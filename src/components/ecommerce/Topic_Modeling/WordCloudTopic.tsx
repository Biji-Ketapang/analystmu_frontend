"use client";

import React, { useState, useEffect } from "react";
import { Wordcloud } from "@visx/wordcloud";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useTopicData } from "@/hooks/usePostDataTopic";

interface Word {
  text: string;
  value: number;
  x?: number;
  y?: number;
  size?: number;
  font?: string;
  rotate?: number;
}

interface WordCloudTopicItem {
  topic: number;
  topicName: string;
  words: Word[];
}

export default function WordCloudTopic() {
  const { data, loading, error } = useTopicData();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // Hindari hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (loading) return <SkeletonLoader height={350} />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data?.wordCloud)
    return <div className="text-gray-500">Data Word Cloud tidak tersedia</div>;

  // Semua topic termasuk -1
  const allTopics: WordCloudTopicItem[] = data.wordCloud;

  // Default pilih topic pertama
  const current =
    selectedTopic === null
      ? allTopics[0]
      : allTopics.find((t) => t.topic === selectedTopic);

  if (!current) return <div>No topic selected</div>;

  const words = current.words;

  // warna manual
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#0891b2",
  ];

  // skala font dengan guard
  const minValue = Math.min(...words.map((w) => w.value)) || 0.1;
  const maxValue = Math.max(...words.map((w) => w.value)) || 1;

  const fontScale = scaleLog({
    domain: [minValue, maxValue],
    range: [15, 60],
  });

  const fontSizeSetter = (d: Word) => fontScale(d.value);

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 w-full transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Topic Word Cloud</h3>

        {/* TOPIC FILTER */}
        <select
          className="px-3 py-2 rounded-lg border bg-white dark:bg-white/10"
          value={selectedTopic ?? allTopics[0].topic}
          onChange={(e) => setSelectedTopic(Number(e.target.value))}
        >
          {allTopics.map((t) => (
            <option key={t.topic} value={t.topic}>
              {t.topicName} {/* hanya nama topic */}
            </option>
          ))}
        </select>
      </div>

      {/* WORD CLOUD */}
      <div className="w-full h-[350px] flex justify-center items-center">
        <Wordcloud
          words={words}
          width={800}
          height={350}
          fontSize={fontSizeSetter}
          font={"Poppins"}
          padding={2}
          spiral="archimedean"
          rotate={0}
          random={() => 0.5}
        >
          {(cloudWords: Word[]) =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor="middle"
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
