# API Reference

This page documents object constructors and the methods available on those objects to render visualizations.

## Types

The following types are used throughout the API to define configuration options and data structures:

### ChartOptions

```ts
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
```

### LineChartOptions

```ts
/**
 * Line chart specific options.
 * @property lineWidth - The thickness of the line in pixels.
 * @property isCurved - Whether the line should be curved (true) or straight (false).
 */
export interface LineChartOptions extends ChartOptions {
  isCurved: boolean;
}
```

### SeriesOptions

```ts
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
```

### ScatterChartOptions

```ts
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
```

### CustomerScatterChartOptions

```ts
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
```

## Chart Constructors

Each object uses similar configuration options. The following constructors are available:

### LineChart

```ts
import type { CartesianPlaneConfig, LineChartOptions } from "vizible-cartesian";

new LineChart(config: CartesianPlaneConfig<LineChartOptions>);
```

**Example:**

```ts
const chart = new LineChart({
  svgSelection: d3.select("svg"),
  dataset: data,
  seriesConfig: {
    xSerie: { field: d => d.x, label: "X Axis" },
    ySeries: [
      { field: d => d.y1, color: "#1f77b4", label: "Y1 Axis" },
      { field: d => d.y2, color: "#ff7f0e", label: "Y2 Axis" }
    ]
  },
  options: {
    margin: { top: 20, right: 40, bottom: 40, left: 60 },
    isCurved: true
  }
});
```

### TimeChart

```ts
import type { CartesianPlaneConfig, LineChartOptions } from "vizible-cartesian";

new TimeChart(config: CartesianPlaneConfig<LineChartOptions>);
```

**Example:**

```ts
const chart = new TimeChart({
  svgSelection: d3.select("svg"),
  dataset: data,
  seriesConfig: {
    xSerie: { field: d => d.date, label: "Date" },
    ySeries: [
      { field: d => d.sales, color: "#1f77b4", label: "Sales" },
      { field: d => d.cost, color: "#ff7f0e", label: "Cost" }
    ]
  },
  options: {
    margin: { top: 20, right: 40, bottom: 40, left: 60 },
    isCurved: true
  }
});
```

### ScatterChart

```ts
import type { ScatterChartConfig, ChartOptions } from "vizible-cartesian";

new ScatterChart(config: ScatterChartConfig<ChartOptions>);
```

**Example:**

```ts
const chart = new ScatterChart({
  svgSelection: d3.select("svg"),
  dataset: data,
  seriesConfig: {
    xSerie: { field: d => d.time, label: "Time" },
    ySeries: [
      { field: d => d.intensity, color: "#1f77b4", label: "Intensity", radii: 5 }
    ]
  },
  options: {
    margin: { top: 20, right: 40, bottom: 40, left: 60 }
  }
});
```

### CustomScatterChart

```ts
import type { CustomScatterChartConfig, ChartOptions } from "vizible-cartesian";

new CustomScatterChart(config: CustomScatterChartConfig<ChartOptions>);
```

**Example:**

```ts
const chart = new CustomScatterChart({
  svgSelection: d3.select("svg"),
  dataset: data,
  seriesConfig: {
    xSerie: { field: d => d.x, label: "X Axis" },
    ySeries: [
      { field: d => d.y, color: "steelblue", label: "Y Axis", size: 1.5 },
      { field: d => d.z, color: "red", label: "Z Axis", icon: "M10 10 H 90 V 90 H 10 L 10 10", size: 0.6 }
    ]
  },
  options: {
    margin: { top: 20, right: 40, bottom: 40, left: 60 }
  }
});
```

## Chart Methods

Each chart object provides methods to render the chart and manipulate its state. Common methods include:

### Series

#### renderSeries

Draws the series data on the chart.

```ts
renderSeries(): void;
```

> [!Note]
> - The `scaleLinear` is used to deal with the numerical values. The other scales of D3.js were not covered in the this library.
> - To style the lines of the series, you can use the `.serie` class in your CSS. For example:
> ```css
> .serie {
>   opacity: 0.8;
>   transition: opacity 0.3s, stroke-width 0.2s;
>
>   &:hover {
>     opacity: 1;
>     stroke-width: 4;
>   }
> }
> ```

### Axis

#### renderYAxis

Draws the Y-axis on the chart. You can optionally pass a D3 number format string to format the Y-axis labels.

```ts
renderYAxis(
  numberFormat?: string // Optional D3 number format string (e.g., ".2f")
): void;
```

#### renderXAxis

Draws the X-axis on the chart. You can optionally pass a D3 time format string for time series or a number format string for numeric axes.

```ts
renderXAxis(
  formatCode?: string // Optional D3 time format string (e.g., "%Y-%m-%d") or number format string (e.g., ".2f")
): void;
```

> [!Note]
> `formatCode` in the `renderXAxis` method can be either a D3 time format string (e.g., "%Y-%m-%d") for time series or a number format string (e.g., ".2f") for numeric axes. For more information about D3 format strings, refer to the [D3 documentation](https://github.com/d3/d3-format).

#### renderYGridLines

Draws horizontal grid lines across the chart based on the Y-axis scale.

```ts
renderYGridLines(): void;
```

#### renderXGridLines

Draws vertical grid lines across the chart based on the X-axis scale.

```ts
renderXGridLines(): void;
```

> [!Note]
> To style lines that represent the grid created by `renderYGridLines` and `renderXGridLines` you can use the `.grid` class in your CSS. For example:
> ```css
> .grid {
>   stroke: #eee;
>   stroke-opacity: 0.7;
>   stroke-dasharray: 2, 2; /* Dashed lines */
> }
> ```

### Label

#### renderLegend

Draws a legend to represent the name and color of each series.

```ts
renderLegend(
  legendItemHeight?: number, // Optional height of each legend item in pixels (default is 20)
  position?: { x?: number, y?: number } // Optional position for the legend (default is { x: innerWidth, y: margin.top })
): void;
```

> [!Note]
> To style the text of each serie legend item, you can use the `.legend-item` class in your CSS. For example:
> ```css
> .legend-item {
>   font-size: 12px;
>   font-weight: bold;
> }
> ```

#### renderChartTitle

Draws the chart title at the top.

```ts
renderChartTitle(
  title: string
): void;
```

#### renderXAxisLabel

Draws the X-axis label.

```ts
renderXAxisLabel(
  label: string
): void;
```

#### renderYAxisLabel

Draws the Y-axis label.

```ts
renderYAxisLabel(
  label: string
): void;
```

> [!Note]
> To style the chart title and each axes label, you can use the `.chart-title` and `.axis-label` class in your CSS, respectively. For example:
>
> ```css
> .chart-title {
>   font-size: 16px;
>   font-weight: bold;
>   text-anchor: middle;
> }
>
> .axis-label {
>   font-size: 12px;
>   font-weight: bold;
>   text-anchor: middle;
> }
> ```

### Cursor

#### renderCursor

Adds an interactive cursor to the chart that follows the mouse movement and displays the data point values.

```ts
renderCursor(): void;
```

> [!Note]
> - The cursor functionality is only available for dynamic charts and line charts. If the chart is static, this method does nothing. The cursor will display the nearest data point values when the mouse moves over the chart area.
> - To style the cursor, you can use the `.cursor` class in your CSS. For example:
> ```css
> .cursor {
>   stroke: #000;
>   stroke-width: 1px;
>   pointer-events: none; /* Prevent mouse events on the cursor */
> }
> ```
