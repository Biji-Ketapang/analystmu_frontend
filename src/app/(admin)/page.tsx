import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RecentOrders";
// import DemographicCard from "@/components/ecommerce/DemographicCard";
import PostTypeAnalysis from "@/components/ecommerce/PostTypeAnalysis";
import EngagementByPostType from "@/components/ecommerce/EngagementByPostType";
import TopEngagementPosts from "@/components/ecommerce/TopEngagementPosts";
import PostMonthWeek from "@/components/ecommerce/PostMonthWeek";
import TimeDayHeatmap from "@/components/ecommerce/TimeOfday";
import WordCloudHashtag from "@/components/ecommerce/WordCloudHashtag";
import HashtagTrendChart from "@/components/ecommerce/HashtagTrendChart";

export const metadata: Metadata = {
  title:
    "AnalysMU | Social Media Analysis Dashboard",
  description: "This is AnalysMU Home Dashboard",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Metrics Cards */}
      <div className="col-span-12">
        <EcommerceMetrics />
      </div>

      {/* Post Type Analysis - Full Width */}
      <div className="col-span-12">
        <PostTypeAnalysis />
      </div>

      {/* Engagement by Post Type & Monthly Engagement */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EngagementByPostType />
        <MonthlySalesChart />
      </div>

      {/* Top Posts & Target */}
      <div className="col-span-12 xl:col-span-5">
        <TopEngagementPosts />
      </div>

      <div className="col-span-12">
        <PostMonthWeek />
      </div>

      <div className="col-span-12">
        <TimeDayHeatmap />
      </div>

      <div className="col-span-12">
        <WordCloudHashtag />
      </div>

      <div className="col-span-12">
        <HashtagTrendChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <WordCloudHashtag />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
