# Tutorials

## Creating a Time Series Chart

1. Follow the steps of the [Getting Started](/getting-started) section and start a project using Vite.

2. Create the `index.html` file in the root of your project with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Time Series Chart</title>
</head>
<body>
    <svg width="800" height="600"></svg>
    <script src="time.ts" type="module" lang="ts"></script>
</body>
</html>
```

3. Create a new TypeScript file called `time.ts` and add the following code:

```ts
import { select } from "d3";
import { TimeChart } from "../src/index.ts";

const data = [
  { date: new Date("2020-01-01"), sales: 10, cost: 5 },
  { date: new Date("2020-02-01"), sales: 20, cost: 10 },
  { date: new Date("2020-03-01"), sales: 30, cost: 15 },
  { date: new Date("2020-04-01"), sales: 40, cost: 20 },
];

const svg = document!.querySelector("svg") as SVGSVGElement;
const selection = select(svg);

const chart = new TimeChart(data, {
  xSerie: { key: "date" },
  ySeries: [
    { key: "sales", color: "#1f77b4", name: "Sales" },
    { key: "cost", color: "#ff7f0e", name: "Cost" },
  ]
});

chart.renderXAxis(selection, "%d %b");
chart.renderYAxis(selection);
chart.renderSeries(selection);
chart.renderLegend(selection);
chart.renderChartTitle(selection, "Sales and Cost Over Time");
chart.renderYAxisLabel(selection, "Sales");
chart.renderXAxisLabel(selection, "Date");

```

This code creates a time series chart. It sets up the data, initializes the chart, and renders the axes, series, legend, and labels.

## Working with Other Libraries

`vizible-cartesian` can be integrated with other libraries like [`D3Snap`](https://github.com/MetalbolicX/d3-snap) that only needs a svg container for server-side rendering.

```ts
import { D3Snap } from "d3-snap";
import { TimeChart } from "vizible-cartesian";

const node = new D3Snap();
const svg = node.createSVG(800, 600);

const data = [
  { date: new Date("2023-01-01"), sales: 100, cost: 80 },
  { date: new Date("2023-02-01"), sales: 120, cost: 90 },
  { date: new Date("2023-03-01"), sales: 150, cost: 110 },
  { date: new Date("2023-04-01"), sales: 170, cost: 130 },
  { date: new Date("2023-05-01"), sales: 200, cost: 150 },
];

const chart = new TimeChart(data, {
  xSerie: { key: "date" },
  ySeries: [
    { key: "sales", name: "Sales", color: "blue" },
    { key: "cost", name: "Cost", color: "orange" },
  ],
});

chart.renderSeries(svg);
console.log("Chart HTML:\n", node.html);
```
