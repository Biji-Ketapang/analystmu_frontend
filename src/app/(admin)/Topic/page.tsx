"use client";

import { useTopicData } from "@/hooks/usePostDataTopic";
import TopicProbabilityDistributionChart from "@/components/ecommerce/Topic_Modeling/TopicProbabilityDistributionChart";
import VoiceOfStudentsTable from "@/components/ecommerce/Topic_Modeling/VoiceOfStudentsTable";
import TopicDistributionBar from "@/components/ecommerce/Topic_Modeling/BarDistributionTopic";
import WordCloudTopic from "@/components/ecommerce/Topic_Modeling/WordCloudTopic";

export default function TopicDashboard() {
  const { data, loading, error } = useTopicData();

  if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;
  if (error || !data) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section (Optional) */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Topic Modelling Analysis</h1>
        <p className="text-gray-500">Analisis topik percakapan sosial media PENS secara otomatis.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Bar Chart & Word Cloud berdampingan jika layar besar */}
        <div className="col-span-12 lg:col-span-12">
          <TopicDistributionBar />
        </div>
        <div className="col-span-12 lg:col-span-12">
          <WordCloudTopic />
        </div>
      </div>

      {/* Probability Chart */}
      <div className="col-span-12">
        <TopicProbabilityDistributionChart />
      </div>
      
      {/* Table Detail - Pass topicSummary here! */}
      <div className="col-span-12">
        <VoiceOfStudentsTable 
          data={data.docTopicsTable} 
          topicSummary={data.topicSummary} // Pastikan hook Anda me-return ini
        />
      </div>
    </div>
  );
}