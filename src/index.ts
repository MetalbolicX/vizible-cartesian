import { LineChart } from "./charts/line/line-series.ts";
import { TimeChart } from "./charts/line/time-series.ts";
import { ScatterChart } from "./charts/scatter/scatter-plot.ts";
import { CustomScatterChart } from "./charts/scatter/custom-scatter-plot.ts";
import type {
  CustomerScatterChartOptions,
  LineChartOptions,
  ScatterChartOptions,
  SeriesOptions,
} from "./types.ts";
import {
  drawXAxisLabel,
  drawYAxisLabel,
  drawChartTitle,
} from "./utils/helpers.ts";

export {
  drawChartTitle,
  drawXAxisLabel,
  drawYAxisLabel,
  CustomScatterChart,
  LineChart,
  ScatterChart,
  TimeChart,
  type CustomerScatterChartOptions,
  type LineChartOptions,
  type ScatterChartOptions,
  type SeriesOptions,
};
