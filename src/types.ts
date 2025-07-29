/**
 * Chart configuration options for all chart types.
 * @property margin - The margin object specifying top, right, bottom, left in pixels.
 * @property tickSize - The size of axis ticks in pixels.
 * @property tickPadding - The padding between ticks and labels in pixels.
 */
export interface ChartOptions {
  margin: { top: number; right: number; bottom: number; left: number };
  tickSize: number;
  tickPadding: number;
  isChartStatic?: boolean;
  transitionTime?: number; // Time in milliseconds for transitions
}

/**
 * Line chart specific options.
 * @property lineWidth - The thickness of the line in pixels.
 * @property isCurved - Whether the line should be curved (true) or straight (false).
 */
export interface LineChartOptions extends ChartOptions {
  isCurved: boolean;
}

/**
 * Series configuration for x or y axes.
 * @property key - The property name in the dataset to use for this series.
 * @property name - Optional display name for the series.
 * @property color - Optional color for the series (CSS color string).
 */
export interface SeriesOptions {
  field: (data: Record<string, unknown>) => Date | number;
  label: string;
  color?: string;
}

/**
 * Scatter chart y series configuration.
 * @property key - The property name in the dataset for y values.
 * @property name - Optional display name for the series.
 * @property color - Optional color for the points (CSS color string).
 * @property radii - Optional radius for the points (number, pixels).
 */
export interface ScatterChartOptions extends SeriesOptions {
  radii?: number;
}

/**
 * Custom scatter chart y series configuration.
 * @property key - The property name in the dataset for y values.
 * @property name - Optional display name for the series.
 * @property color - Optional color for the icons (CSS color string).
 * @property icon - Optional SVG path string for custom icon.
 * @property size - Optional scaling factor for the icon (number, default 1).
 */
export interface CustomerScatterChartOptions extends SeriesOptions {
  icon?: string;
  size?: number;
}
