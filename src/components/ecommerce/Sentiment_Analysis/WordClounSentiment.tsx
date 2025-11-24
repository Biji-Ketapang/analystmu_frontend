"use client";

import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { Wordcloud } from "@visx/wordcloud";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import SkeletonLoader from "@/components/common/SkeletonLoader";

interface Word {
  text: string;
  value: number;
  x?: number;
  y?: number;
  size?: number;
  font?: string;
  rotate?: number;
}

export default function WordCloudTopic() {
  const [selectedSentiment, setSelectedSentiment] = useState("positive");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  /** -------------------------
   *  MAP DATASET SENTIMENT
   *  ------------------------- */
  const sentimentFiles: Record<string, string> = {
    positive: "/data/result_sentiment/sentiment_positive.csv",
    neutral: "/data/result_sentiment/sentiment_neutral.csv",
    negative: "/data/result_sentiment/sentiment_negative.csv",
    all: "/data/result_sentiment/sentiment_analysis_full.csv", // <-- TAMBAHAN BARU
  };

  /** -------------------------
   *  LOAD CSV PER SENTIMENT
   *  ------------------------- */
  const loadSentimentCSV = useCallback(async (sentiment: string) => {
    setLoading(true);

    const response = await fetch(sentimentFiles[sentiment]);
    const text = await response.text();

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const captions: string[] = result.data.map((row: { caption: string }) => row.caption);

        // Hitung frekuensi kata
        const freq: Record<string, number> = {};

        captions.forEach((cap) => {
          if (!cap) return;

          cap
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .split(" ")
            .filter((w) => w.length > 2)
            .forEach((word) => {
              freq[word] = (freq[word] || 0) + 1;
            });
        });

        // Batasi 100 kata teratas
        const limited: Word[] = Object.keys(freq)
          .map((key) => ({ text: key, value: freq[key] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 100);

        setWords(limited);
        setLoading(false);
      },
    });
  }, [sentimentFiles]);

  /** load default */
  useEffect(() => {
    loadSentimentCSV(selectedSentiment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSentiment]);

  if (loading) return <SkeletonLoader height={350} />;

  if (words.length === 0)
    return (
      <div className="text-red-500">
        Tidak ada kata ditemukan pada {selectedSentiment} sentiment.
      </div>
    );

  /** -------------------------
   *  WORD CLOUD SCALE
   *  ------------------------- */
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#0891b2",
  ];

  const minValue = Math.min(...words.map((w) => w.value)) || 1;
  const maxValue = Math.max(...words.map((w) => w.value)) || 10;

  const fontScale = scaleLog({
    domain: [minValue, maxValue],
    range: [15, 60],
  });

  const fontSizeSetter = (d: Word) => fontScale(d.value);

  return (
    <div className="p-5 rounded-xl border bg-white dark:bg-white/5 w-full transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Sentiment Word Cloud</h3>

        {/* SENTIMENT FILTER */}
        <select
          className="px-3 py-2 rounded-lg border bg-white dark:bg-white/10 capitalize"
          value={selectedSentiment}
          onChange={(e) => setSelectedSentiment(e.target.value)}
        >
          <option value="all">All</option> {/* <-- TAMBAHAN BARU */}
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
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
