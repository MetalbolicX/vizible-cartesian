# API Reference

This page documents object constructors and the methods available on those objects to render visualizations.

## Types

The following types are used throughout the API to define configuration options and data structures:

### ChartOptions

```ts
interface ChartOptions {
  width: number; // Chart width in pixels.
  height: number; // Chart height in pixels.
  margin: { top: number; right: number; bottom: number; left: number }; // Chart margins in pixels.
  tickSize: number; // Axis tick size in pixels.
  tickPadding: number; // Padding between ticks and labels in pixels.
}
```

### LineChartOptions

```ts
interface LineChartOptions extends ChartOptions {
  lineWidth: number; // Line thickness in pixels.
  isCurved: boolean; // If true, lines are curved; otherwise, straight.
}
```

### SeriesOptions

```ts
interface SeriesOptions {
  key: string; // Property name in the dataset for this series.
  name?: string; // Optional display name for the series.
  color?: string; // Optional CSS color string for the series.
}
```

### ScatterChartOptions

```ts
interface ScatterChartOptions extends SeriesOptions {
  radii?: number; // Optional radius for scatter points (pixels).
}
```

### CustomerScatterChartOptions

```ts
interface CustomerScatterChartOptions extends SeriesOptions {
  icon?: string; // Optional SVG path string for custom icon.
  size?: number; // Optional scaling factor for the icon (default is 1).
}
```


## Chart Constructors

Each object uses similar configuration options. The following constructors are available:

### LineChart

```ts
new LineChart(
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: { key: string };
    ySeries: SeriesOptions[];
  },
  options?: Partial<LineChartOptions>
)
```

### TimeChart

```ts
new TimeChart(
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: { key: string };
    ySeries: SeriesOptions[];
  },
  options?: Partial<TimeChartOptions>
)
```

### ScatterChart

```ts
new ScatterChart(
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: SeriesOptions;
    ySeries: SeriesOptions[];
  },
  options?: Partial<ScatterChartOptions>
)
  ```

### CustomScatterChart

```ts
new CustomScatterChart(
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: SeriesOptions;
    ySeries: CustomerScatterChartOptions[];
  },
  options?: Partial<ChartOptions>
)
```

## Chart Methods

Each chart object provides methods to render the chart and manipulate its state. Common methods include:

### renderSeries

Draws the series data on the chart.

```ts
renderSeries(selection: Selection<SVGSVGElement, unknown, null, undefined>
): void;
```

### renderYAxis

Draws the Y-axis on the chart. In addition your can optionally pass a D3 number format string to format the Y-axis labels.

```ts
renderYAxis(selection: Selection<SVGSVGElement, unknown, null, undefined>,
  numberFormat?: string // Optional D3 number format string (e.g., ".2f")
): void;
```

### renderXAxis

Draws the X-axis on the chart. You can optionally pass a D3 time format string for time series or a number format string for numeric axes.

```ts
renderXAxis(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  formatCode?: string // Optional D3 time format string (e.g., "%Y-%m-%d") or number format string (e.g., ".2f")
): void;
```

> [!Note]
> - `formatCode` in the `renderXAxis` method can be either a D3 time format string (e.g., "%Y-%m-%d") for time series or a number format string (e.g., ".2f") for numeric axes.
> - For more information about D3 format strings, refer to the [D3 documentation](https://github.com/d3/d3-format).

### renderYGridLines

Draws horizontal grid lines across the chart based on the Y-axis scale.

```ts
renderYGridLines(
  selection: Selection<SVGSVGElement, unknown, null, undefined>
): void;
```

### renderXGridLines

Draws vertical grid lines across the chart based on the X-axis scale.

```ts
renderXGridLines(
  selection: Selection<SVGSVGElement, unknown, null, undefined>
): void;
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

### renderLegend

Draws a legend to represent the name and color of each series.

```ts
renderLegend(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  x?: number, // X position for the legend
  y?: number // Y position for the legend
): void;
```

> [!Note]
> `x` and `y` positions for the legend are optional and by default the value of both is 20.

## Helpers Functions

`vizible-cartesian` provides several helper functions to assist with rendering common chart elements.

### renderChartTitle

Draws the chart title at the top.

```ts
renderChartTitle(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  title: string,
  margin: { top: number; left: number; right: number; bottom: number; }
): void;
```
> [!Note]
> To style the chart title, you can use the `.chart-title` class in your CSS. For example:
> ```css
> .chart-title {
>   font-size: 16px;
>   font-weight: bold;
>   text-anchor: middle;
> }
> ```

### renderXAxisLabel

Draws the X-axis label.

```ts
renderXAxisLabel(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  label: string,
  margin: { left: number; right: number; top: number; bottom: number }
): void;
```

### renderYAxisLabel

Draws the Y-axis label.

```ts
renderYAxisLabel(
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  label: string,
  margin: { left: number; right: number; top: number; bottom: number }
): void;
```

> [!Note]
> To style the axis labels created by the `renderXAxisLabel` and `renderYAxisLabel` functions, you can use the `.axis-label` class in your CSS. For example:
> ```css
> .axis-label {
>   font-size: 12px;
>   font-weight: bold;
>   text-anchor: middle;
> }
> ```
