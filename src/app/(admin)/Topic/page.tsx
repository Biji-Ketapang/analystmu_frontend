"use client";

import { useTopicData } from "@/hooks/usePostDataTopic";
// import BarTopWords from "@/components/ecommerce/Topic_Modeling/BarTopWords";
// import StackedTopWords from "@/components/ecommerce/Topic_Modeling/BarTopWords";
// import DonutDistribution from "@/components/ecommerce/Topic_Modeling/DonutDistribution";
import TopicDistributionBar from "@/components/ecommerce/Topic_Modeling/BarDistributionTopic";
import WordCloudTopic from "@/components/ecommerce/Topic_Modeling/WordCloudTopic";

export default function TopicDashboard() {
  const { data, loading, error } = useTopicData();

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error: {error}</p>;

console.log("DATA MASUK:", data);
console.log("BAR TOP WORDS:", data.barTopWords);


  return (
    <div className="space-y-12">
      {/* <div className="col-span-12 bg-white p-5">
      <BarTopWords data={data} />
      </div> */}
      
      <div className="col-span-12">
      <TopicDistributionBar />
      </div>

      <div className="col-span-12">
      <WordCloudTopic />
      </div>
      {/* Nanti tambah komponen lain */}
      {/* <DonutTopicDistribution data={data} />
      <DocTopicsTable data={data} />
      <TopicTrendsChart data={data} />
      <TopicBubbleChart data={data} /> */}
    </div>
  );
}
