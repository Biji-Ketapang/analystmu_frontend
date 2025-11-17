// hooks/usePostData2.ts
import { useState, useEffect } from "react";
import { parseCSVPost, processPostData2, ProcessedPostInsights } from "@/utils/dataProcessorPost";
import { useAccount } from "@/context/AccountContext";

export function usePostData2() {
  const [data, setData] = useState<ProcessedPostInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account } = useAccount();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const file = "/data/pens_posts_stemming.csv";
        // Untuk ITS dan PPNS, tetap ambil dari pens_posts_stemming.csv jika data belum tersedia
        // if (account === "ITS") file = "/data/its_posts_stemming.csv";
        // if (account === "PPNS") file = "/data/ppns_posts_stemming.csv";

        const res = await fetch(file);
        const csvText = await res.text();

        const posts = parseCSVPost(csvText);
        const processed = processPostData2(posts);

        console.log("Account:", account);
        console.log("Fetch:", file);
        console.log("Status:", res.status);
        console.log("Text len:", csvText.length);
        console.log("Parsed posts:", posts.length);
        console.log("Processed:", processed);


        setData(processed);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [account]);

  return { data, loading, error };
}
