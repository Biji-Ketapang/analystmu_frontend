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

const DAYS_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// Parse CSV
export function parseCSVPost(csvText: string): Post[] {
  const lines = csvText.split("\n");
  // Skip header row:
  // const headers = lines[0].split(",");

  const posts: Post[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",");

    posts.push({
      post_type: values[0]?.trim() || "",
      caption: values[1]?.trim() || "",
      like_count: parseInt(values[2]) || 0,
      comment_count: parseInt(values[3]) || 0,
      date: values[4]?.trim() || "",
      time: values[5]?.trim() || "",
    });
  }

  return posts;
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

  let morning = 0,
    afternoon = 0,
    evening = 0;
  let morningC = 0,
    afternoonC = 0,
    eveningC = 0;

  const hashtagWordCount: Record<string, number> = {};
  const hashtagTrendMap = new Map<string, number>();

  posts.forEach((p) => {
    const d = new Date(p.date + "T" + p.time);
    const month = d.getMonth();
    const weekIdx = Math.min(Math.floor(d.getDate() / 7), 3);

    // === POST HEATMAP ===
    postHeatmap[weekIdx][month]++;

    // === ENGAGEMENT HEATMAP ===
    const dayIdx = DAYS_ORDER.indexOf(
      d.toLocaleDateString("en-US", { weekday: "long" })
    );

    const hour = d.getHours();
    const blockIdx = TIME_BLOCKS.findIndex(
      ([s, e]) => hour >= s && hour <= e
    );

    engagementHeatmap[dayIdx][blockIdx] +=
      p.like_count + p.comment_count;

    engagementCount[dayIdx][blockIdx]++;

    const eng = p.like_count + p.comment_count;
    if (hour < 12) {
      morning += eng;
      morningC++;
    } else if (hour < 17) {
      afternoon += eng;
      afternoonC++;
    } else {
      evening += eng;
      eveningC++;
    }

    // === HASHTAG WORDCLOUD ===
    const tags = p.caption.match(/#[a-zA-Z0-9_]+/g) || [];
    tags.forEach((tag) => {
      const key = tag.toLowerCase();
      hashtagWordCount[key] = (hashtagWordCount[key] || 0) + 1;
    });

    // === HASHTAG TREND ===
    const dateKey = p.date;
    hashtagTrendMap.set(
      dateKey,
      (hashtagTrendMap.get(dateKey) || 0) + tags.length
    );
  });

  const finalEngagementHeatmap = engagementHeatmap.map((row, i) =>
    row.map((val, j) =>
      engagementCount[i][j]
        ? Math.round(val / engagementCount[i][j])
        : 0
    )
  );

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
  };
}
