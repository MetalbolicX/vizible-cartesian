export interface ChartOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  tickSize: number;
  tickPadding: number;
}

export interface LineChartOptions extends ChartOptions {
  lineWidth: number;
  isCurved: boolean;
}

export interface SeriesOptions {
  key: string;
  name?: string;
  color?: string;
}

export interface ScatterChartOptions extends SeriesOptions {
  radii?: number;
}
