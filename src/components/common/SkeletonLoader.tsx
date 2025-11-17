import React from "react";

export default function SkeletonLoader({ height = 200, width = "100%", borderRadius = 12 }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-loading 1.5s infinite linear",
      }}
      className="animate-pulse"
    />
  );
}

// Add global CSS for skeleton animation in your main CSS file:
// @keyframes skeleton-loading {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
