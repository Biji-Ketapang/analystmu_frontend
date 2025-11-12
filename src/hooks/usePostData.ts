import { useEffect, useState } from 'react';
import { useAccount } from '@/context/AccountContext';
import { parseCSV, processPostData, ProcessedData } from '@/utils/dataProcessor';

export function usePostData() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let filePath = '/data/pens_posts_stemming.csv';
        if (account === 'ITS') filePath = '/data/its_posts_stemming.csv';
        if (account === 'PPNS') filePath = '/data/ppns_posts_stemming.csv';
        // Untuk ITS dan PPNS, fallback ke PENS jika file belum ada
        const response = await fetch(filePath);
        if (!response.ok) {
          // fallback ke PENS jika file ITS/PPNS tidak ditemukan
          filePath = '/data/pens_posts_stemming.csv';
          const fallbackResponse = await fetch(filePath);
          if (!fallbackResponse.ok) throw new Error('Failed to fetch CSV file');
          const csvText = await fallbackResponse.text();
          const posts = parseCSV(csvText);
          const processedData = processPostData(posts);
          setData(processedData);
          setError(null);
        } else {
          const csvText = await response.text();
          const posts = parseCSV(csvText);
          const processedData = processPostData(posts);
          setData(processedData);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account]);

  return { data, loading, error };
}
