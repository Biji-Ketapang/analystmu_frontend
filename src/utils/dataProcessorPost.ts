import Papa from "papaparse";

export interface Post {
  post_type: string;
  caption: string;
  like_count: number;
  comment_count: number;
  date: string;
  time: string;
}

export interface ProcessedPostInsights {
  postHeatmap: number[][];
  engagementHeatmap: number[][];
  timeOfDayEngagement: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  hashtagWordCount: Record<string, number>;
  hashtagTrends: { date: string; count: number }[];
  timeDayHeatmap: Record<string, Record<number, number>>;
}

const TIME_BLOCKS = [
  [0, 3],
  [4, 6],
  [7, 9],
  [10, 12],
  [13, 15],
  [16, 18],
  [19, 21],
  [22, 23],
];

const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function parseCSVPost(csvText: string): Post[] {
  const result = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });

  return (result.data as Record<string, string>[]).map((row: Record<string, string>) => ({
    post_type: row.post_type || "",
    caption: row.caption || "",
    like_count: parseInt(row.like_count) || 0,
    comment_count: parseInt(row.comment_count) || 0,
    date: row.date || "",
    time: row.time || "",
  }));
}

export function processPostData2(posts: Post[]): ProcessedPostInsights {
  const postHeatmap: number[][] = Array(4)
    .fill(null)
    .map(() => Array(12).fill(0));

  const engagementHeatmap: number[][] = Array(7)
    .fill(null)
    .map(() => Array(8).fill(0));

  const engagementCount: number[][] = Array(7)
    .fill(null)
    .map(() => Array(8).fill(0));

  const rawTimeDaySum: Record<string, Record<number, number>> = {};
  const rawTimeDayCount: Record<string, Record<number, number>> = {};

  DAYS_ORDER.forEach((day) => {
    rawTimeDaySum[day] = {};
    rawTimeDayCount[day] = {};
    for (let h = 0; h < 24; h++) {
      rawTimeDaySum[day][h] = 0;
      rawTimeDayCount[day][h] = 0;
    }
  });

  let morning = 0,
    afternoon = 0,
    evening = 0;
  let morningC = 0,
    afternoonC = 0,
    eveningC = 0;

  const hashtagWordCount: Record<string, number> = {};
  const hashtagTrendMap = new Map<string, number>();

  posts.forEach((p) => {
    const d = new Date(`${p.date}T${p.time}`);
    const month = d.getMonth();
    const weekIdx = Math.min(Math.floor(d.getDate() / 7), 3);

    // POST COUNT HEATMAP
    postHeatmap[weekIdx][month]++;

    // TIME BLOCK
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    const dayIdx = DAYS_ORDER.indexOf(dayName);
    const hour = d.getHours();
    const blockIdx = TIME_BLOCKS.findIndex(([s, e]) => hour >= s && hour <= e);

    const engagement = p.like_count + p.comment_count;

    engagementHeatmap[dayIdx][blockIdx] += engagement;
    engagementCount[dayIdx][blockIdx]++;

    // TIME OF DAY
    if (hour < 12) {
      morning += engagement;
      morningC++;
    } else if (hour < 17) {
      afternoon += engagement;
      afternoonC++;
    } else {
      evening += engagement;
      eveningC++;
    }

    p.caption = p.caption || ""; // memastikan caption tidak null/undefined

    const words = p.caption.toLowerCase().split(/\s+/);

    // ambil kata yang panjangnya >= 6
    const tags = words.filter(w => /^[a-z]+$/.test(w) && w.length >= 6);



    tags.forEach((tag) => {
      const key = tag.toLowerCase();
      hashtagWordCount[key] = (hashtagWordCount[key] || 0) + 1;
    });

    const dateKey = p.date;
    hashtagTrendMap.set(dateKey, (hashtagTrendMap.get(dateKey) || 0) + tags.length);

    // RAW 7×24
    rawTimeDaySum[dayName][hour] += engagement;
    rawTimeDayCount[dayName][hour]++;
  });

  // AVERAGE HEATMAP
  const finalEngagementHeatmap = engagementHeatmap.map((row, i) =>
    row.map((val, j) =>
      engagementCount[i][j] ? Math.round(val / engagementCount[i][j]) : 0
    )
  );

  // 7 × 24 HEATMAP
  const timeDayHeatmap: Record<string, Record<number, number>> = {};

  DAYS_ORDER.forEach((day) => {
    timeDayHeatmap[day] = {};
    for (let h = 0; h < 24; h++) {
      const total = rawTimeDaySum[day][h];
      const cnt = rawTimeDayCount[day][h];
      timeDayHeatmap[day][h] = cnt ? total / cnt : 0;
    }
  });

  return {
    postHeatmap,
    engagementHeatmap: finalEngagementHeatmap,

    timeOfDayEngagement: {
      morning: morningC ? morning / morningC : 0,
      afternoon: afternoonC ? afternoon / afternoonC : 0,
      evening: eveningC ? evening / eveningC : 0,
    },

    hashtagWordCount,
    hashtagTrends: Array.from(hashtagTrendMap).map(([date, count]) => ({
      date,
      count,
    })),

    timeDayHeatmap,
  };
}
