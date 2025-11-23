import { useState, useEffect } from "react";
import { parseCSV, processTopicData, TopicInsights } from "@/utils/topicProcessor";

export function useTopicData() {
  const [data, setData] = useState<TopicInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // === 3 FILE CSV BER-TOPIC ===
        const files = [
          "/data/Topic-Modeling/document_topics.csv",
          "/data/Topic-Modeling/topic_summary.csv",
          "/data/Topic-Modeling/topic_words.csv",
        ];

        // Load all CSV
        const [docCSV, summaryCSV, wordsCSV] = await Promise.all(
          files.map(async (file) => {
            const res = await fetch(file);
            const text = await res.text();
            return text;
          })
        );

        // Parse CSV
        const documentTopics = parseCSV(docCSV);
        const topicSummary = parseCSV(summaryCSV);
        const topicWords = parseCSV(wordsCSV);

        // Proses menjadi bentuk siap visualisasi
        const processed = processTopicData(documentTopics, topicSummary, topicWords);

        console.log("Parsed Document Topics:", documentTopics.length);
        console.log("Parsed Summary:", topicSummary.length);
        console.log("Parsed Words:", topicWords.length);
        console.log("Processed Result:", processed);

        setData(processed);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
}
