// Utility untuk memproses data CSV

export interface Post {
  post_type: string;
  caption: string;
  like_count: number;
  comment_count: number;
  date: string;
  time: string;
}

export interface ProcessedData {
  totalPosts: number;
  totalFollowers: number;
  avgLikes: number;
  avgComments: number;
  postTypeStats: PostTypeStat[];
  postTypeEngagement: PostTypeEngagement[];
  topPosts: TopPost[];
  monthlyEngagement: MonthlyEngagement[];
}

export interface PostTypeStat {
  type: string;
  count: number;
  percentage: number;
}

export interface PostTypeEngagement {
  type: string;
  avgEngagement: number;
  avgLikes: number;
  avgComments: number;
}

export interface TopPost {
  caption: string;
  type: string;
  likes: number;
  comments: number;
  engagement: number;
  date: string;
}

export interface MonthlyEngagement {
  month: string;
  avgEngagement: number;
  postCount: number;
}

// Parse CSV data dari string
export function parseCSV(csvText: string): Post[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const posts: Post[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    // Handle CSV dengan quoted fields yang mungkin mengandung koma
    const values = parseCSVLine(lines[i]);
    
    if (values.length >= headers.length) {
      const post: Post = {
        post_type: values[0]?.trim() || '',
        caption: values[1]?.trim() || '',
        like_count: parseInt(values[2]) || 0,
        comment_count: parseInt(values[3]) || 0,
        date: values[4]?.trim() || '',
        time: values[5]?.trim() || '',
      };
      
      if (post.post_type) {
        posts.push(post);
      }
    }
  }

  return posts;
}

// Parse satu baris CSV dengan handling untuk quoted fields
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

// Hitung engagement (likes + comments)
export function calculateEngagement(post: Post): number {
  return post.like_count + post.comment_count;
}

// Process semua data
export function processPostData(posts: Post[]): ProcessedData {
  const totalPosts = posts.length;
  
  // Hitung total likes dan comments
  const totalLikes = posts.reduce((sum, p) => sum + p.like_count, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comment_count, 0);
  
  const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts * 100) / 100 : 0;
  const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts * 100) / 100 : 0;

  // Analisis jenis postingan
  const postTypeMap = new Map<string, number>();
  posts.forEach(p => {
    postTypeMap.set(p.post_type, (postTypeMap.get(p.post_type) || 0) + 1);
  });

  const postTypeStats: PostTypeStat[] = Array.from(postTypeMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalPosts) * 10000) / 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Engagement per jenis postingan
  const postTypeEngagementMap = new Map<string, { likes: number[]; comments: number[]; count: number }>();
  
  posts.forEach(p => {
    if (!postTypeEngagementMap.has(p.post_type)) {
      postTypeEngagementMap.set(p.post_type, { likes: [], comments: [], count: 0 });
    }
    const stat = postTypeEngagementMap.get(p.post_type)!;
    stat.likes.push(p.like_count);
    stat.comments.push(p.comment_count);
    stat.count++;
  });

  const postTypeEngagement: PostTypeEngagement[] = Array.from(postTypeEngagementMap.entries())
    .map(([type, stat]) => ({
      type,
      avgEngagement: Math.round((stat.likes.reduce((a, b) => a + b, 0) + stat.comments.reduce((a, b) => a + b, 0)) / stat.count * 100) / 100,
      avgLikes: Math.round((stat.likes.reduce((a, b) => a + b, 0) / stat.count) * 100) / 100,
      avgComments: Math.round((stat.comments.reduce((a, b) => a + b, 0) / stat.count) * 100) / 100,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);

  // Top 3 postingan dengan engagement tertinggi
  const topPosts: TopPost[] = posts
    .map(p => ({
      caption: p.caption.substring(0, 80) + (p.caption.length > 80 ? '...' : ''),
      type: p.post_type,
      likes: p.like_count,
      comments: p.comment_count,
      engagement: calculateEngagement(p),
      date: p.date,
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3);

  // Rata-rata engagement per bulan
  const monthlyMap = new Map<string, { engagement: number; count: number }>();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  posts.forEach(p => {
    const dateObj = new Date(p.date);
    const monthKey = `${monthNames[dateObj.getMonth()]}`;
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { engagement: 0, count: 0 });
    }
    
    const stat = monthlyMap.get(monthKey)!;
    stat.engagement += calculateEngagement(p);
    stat.count++;
  });

  const monthlyEngagement: MonthlyEngagement[] = monthNames
    .map(month => {
      const stat = monthlyMap.get(month);
      return {
        month,
        avgEngagement: stat ? Math.round((stat.engagement / stat.count) * 100) / 100 : 0,
        postCount: stat?.count || 0,
      };
    });

  // Untuk followers, karena tidak ada di data, gunakan nilai default atau placeholder
  const totalFollowers = 0; // Bisa di-update jika ada data followers

  return {
    totalPosts,
    totalFollowers,
    avgLikes,
    avgComments,
    postTypeStats,
    postTypeEngagement,
    topPosts,
    monthlyEngagement,
  };
}
