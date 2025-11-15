declare module 'react-heatmap-grid' {
  import React from 'react';

  interface HeatMapProps {
    xLabels: string[];
    yLabels: string[];
    data: number[][];
    background?: string;
    height?: number;
    width?: number;
    cellStyle?: (background: string, value: number, min: number, max: number, data: number[][], x: number, y: number) => React.CSSProperties;
    cellRender?: (value: number) => React.ReactNode;
    title?: (value: number, unit?: string) => string;
    unit?: string;
    squares?: boolean;
    onClick?: (x: number, y: number) => void;
    [key: string]: any;
  }

  const HeatMap: React.ComponentType<HeatMapProps>;
  export default HeatMap;
}
