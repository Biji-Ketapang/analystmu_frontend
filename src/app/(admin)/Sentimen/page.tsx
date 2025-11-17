import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";

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
    </div>
  );
}
