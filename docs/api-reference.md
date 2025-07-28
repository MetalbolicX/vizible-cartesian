# API Reference

This page documents object constructors and the methods available on those objects to render visualizations.

## Types

The following types are used throughout the API to define configuration options and data structures:

### ChartOptions

```ts
interface ChartOptions {
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
  field: (data: Record<string, unknown>) => Date | number; // Function to extract value from data.
  label: string; // Display name for the series.
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
  icon?: string; // Optional SVG path string for custom icon. If provided, it will be used instead of a circle.
  size?: number; // Optional scaling factor for the icon (default is 1).
}
```

## Chart Constructors

Each object uses similar configuration options. The following constructors are available:

### LineChart

```ts
new LineChart(
  svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: SeriesOptions;
    ySeries: SeriesOptions[];
  },
  options?: Partial<LineChartOptions>
)
```

### TimeChart

```ts
new TimeChart(
  svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: SeriesOptions;
    ySeries: SeriesOptions[];
  },
  options?: Partial<LineChartOptions>
)
```

### ScatterChart

```ts
new ScatterChart(
  svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
  dataset: Record<string, unknown>[],
  seriesConfig: {
    xSerie: SeriesOptions;
    ySeries: ScatterChartOptions[];
  },
  options?: Partial<ChartOptions>
)
```

### CustomScatterChart

```ts
new CustomScatterChart(
  svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
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

### Series

#### renderSeries

Draws the series data on the chart.

```ts
renderSeries(): void;
```

> [!Note]
> The `scaleLinear` is used to deal with the numerical values. The other scales of D3.js were not covered in the this library.

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
