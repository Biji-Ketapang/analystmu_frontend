import Papa from "papaparse";

/* =========================================================
   1. CSV PARSER
========================================================= */
export function parseCSV(csvText: string) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data as Record<string, any>[];
}

/* =========================================================
   2. TIPE DATA VISUALISASI
========================================================= */
export interface TopicInsights {
  barTopWords: {
    topic: number;
    words: { word: string; score: number }[];
  }[];

  stackedTopWords: {
    word: string;
    [key: string]: number | string;
  }[];

  donutDistribution: {
    topic: number;
    count: number;
    summary?: string;
  }[];

  docTopicsTable: {
    doc_id: string;
    text?: string;
    topic: number;
    probability: number;
    date?: string;
  }[];

  topicTrends: {
    date: string;
    topicCounts: Record<number, number>;
  }[];

  topicBubble: {
    topic: number;
    size: number;
    summary: string;
    topWords: string[];
  }[];

  /* 🔥 Tambahan baru */
  wordCloud: {
    topic: number;
    topicName: string;
    words: { text: string; value: number }[];
  }[];
}

/* =========================================================
   3. PROCESSOR FIXED — SESUAI CSV KAMU
========================================================= */
export function processTopicData(
  documentTopics: any[],
  topicSummary: any[],
  topicWords: any[]
): TopicInsights {
  
  /* =========================================================
     Mapping Topic ke Custom Name
  ========================================================= */
  const topicNameMap: Record<number, string> = {
    [-1]: "Promosi & Kampanye Vokasi",
     0 : "Kegiatan Kampus & Kompetisi Akademik",
     1 : "Prestasi Mahasiswa & Kompetisi",
     2 : "Pengembangan Teknologi & Industri",
     3 : "Inovasi Mahasiswa & Kegiatan Sosial",
     4 : "Tugas Akademik & Ujian",
  };

  /* =========================================================
     1. TOP WORDS PER TOPIC
  ========================================================= */
  const topicMap: Record<number, { word: string; score: number }[]> = {};

  topicWords.forEach((row) => {
    const topic = Number(row.topic);
    const word = row.word?.trim();
    const score = Number(row.score);

    if (!word) return;

    if (!topicMap[topic]) topicMap[topic] = [];
    topicMap[topic].push({ word, score });
  });

  const barTopWords = Object.entries(topicMap).map(([topic, words]) => ({
    topic: Number(topic),
    topicName: topicNameMap[Number(topic)] ?? `Topic ${topic}`,
    words: words.sort((a, b) => b.score - a.score).slice(0, 10),
  }));

  /* =========================================================
     2. STACKED BAR CHART
  ========================================================= */
  const stackedMap: Record<string, any> = {};
  Object.entries(topicMap).forEach(([topic, words]) => {
    const tKey = `t${topic}`;
    words.forEach((w) => {
      if (!stackedMap[w.word]) stackedMap[w.word] = { word: w.word };
      stackedMap[w.word][tKey] = w.score;
    });
  });
  const stackedTopWords = Object.values(stackedMap);

  /* =========================================================
     3. DONUT DISTRIBUTION
  ========================================================= */
  const donutDistribution = topicSummary.map((row) => {
    const topicNum = Number(row.Topic);
    const countNum = Number(row.Count);

    return {
      topic: isNaN(topicNum) ? -1 : topicNum,
      topicName: topicNameMap[topicNum] ?? row.CustomName ?? `Topic ${topicNum}`,
      count: isNaN(countNum) ? 0 : countNum,
      summary: row.CustomName ?? "",
    };
  });

  /* =========================================================
     4. DOCUMENT TABLE
  ========================================================= */
  const docTopicsTable = documentTopics.map((row) => ({
    doc_id: row.doc_id ?? row.document_id ?? "",
    text: row.text ?? "",
    topic: Number(row.topic ?? 0),
    topicName: topicNameMap[Number(row.topic ?? 0)] ?? `Topic ${row.topic ?? 0}`,
    probability: Number(row.probability ?? row.prob ?? 0),
    date: row.date ?? null,
  }));

  /* =========================================================
     5. TOPIC TRENDS
  ========================================================= */
  const trendMap: Record<string, Record<number, number>> = {};
  documentTopics.forEach((row) => {
    if (!row.date) return;
    const date = row.date;
    const topic = Number(row.topic ?? 0);
    if (!trendMap[date]) trendMap[date] = {};
    trendMap[date][topic] = (trendMap[date][topic] ?? 0) + 1;
  });
  const topicTrends = Object.entries(trendMap).map(([date, counts]) => ({
    date,
    topicCounts: counts,
  }));

  /* =========================================================
     6. BUBBLE CHART
  ========================================================= */
  const bubbleMap: Record<number, { size: number; summary: string }> = {};
  topicSummary.forEach((row) => {
    const t = Number(row.Topic);
    bubbleMap[t] = {
      size: Number(row.Count),
      summary: row.CustomName ?? "",
    };
  });

  const topicBubble = Object.entries(topicMap).map(([topic, words]) => ({
    topic: Number(topic),
    topicName: topicNameMap[Number(topic)] ?? `Topic ${topic}`,
    size: bubbleMap[Number(topic)]?.size ?? 0,
    summary: bubbleMap[Number(topic)]?.summary ?? "",
    topWords: words.slice(0, 5).map((w) => w.word),
  }));

  /* =========================================================
     7. WORD CLOUD (🔥 tambahan baru)
  ========================================================= */
  const wordCloud = Object.entries(topicMap).map(([topic, words]) => ({
    topic: Number(topic),
    topicName: topicNameMap[Number(topic)] ?? `Topic ${topic}`,
    words: words.map((w) => ({
      text: w.word,
      value: w.score, // nilai untuk ukuran word
    })),
  }));

  /* =========================================================
     RETURN SEMUA VISUALISASI
  ========================================================= */
  return {
    barTopWords,
    stackedTopWords,
    donutDistribution,
    docTopicsTable,
    topicTrends,
    topicBubble,
    wordCloud,
  };
}
