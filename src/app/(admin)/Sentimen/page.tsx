"use client";

import SentimentDistribution from "@/components/ecommerce/Sentiment_Analysis/PieDistribution";
import TopEngagementPostsCSV from "@/components/ecommerce/Sentiment_Analysis/TopSentimentPost";
import WordCloudTopic from "@/components/ecommerce/Sentiment_Analysis/WordClounSentiment";

export default function Sentiment() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Metrics Cards */}
      <div className="col-span-12">
        <SentimentDistribution />
      </div>
      <div className="col-span-12">
        <TopEngagementPostsCSV />
      </div>
      <div className="col-span-12">
        <WordCloudTopic />
      </div>
    </div>
  );
}
