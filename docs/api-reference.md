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

```ts
renderSeries(seriesKey: string): void;
```
