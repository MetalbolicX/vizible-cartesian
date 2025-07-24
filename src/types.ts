export interface LineChartOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  lineWidth: number;
  isCurved: boolean;
  tickSize: number;
  tickPadding: number;
}

export type SeriesOptions = {
  key: string;
  name?: string;
  color?: string;
};
