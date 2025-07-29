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
import { selectm, tsv } from "d3";
import { TimeChart } from "vizible-cartesian";

const parseRow = (row) => {
  row.date = new Date(row.date);
  row.america = parseFloat(row.america);
  row.europa = parseFloat(row.europa);
  row.asia = parseFloat(row.asia);
  return row;
};

const data = tsv(
  "https://raw.githubusercontent.com/Apress/create-web-charts-w-d3/refs/heads/master/D3Charts/charts_local/data_02.tsv",
  parseRow
);

const svg = document!.querySelector("svg") as SVGSVGElement;
const selection = select(svg);

const chart = new TimeChart(
  selection,
  await data,
  {
    xSerie: { field: ({ date }) => date as Date, label: "Date" },
    ySeries: [
      {
        field: ({ america }) => america as number,
        color: "#1f77b4",
        label: "America",
      },
      {
        field: ({ europa }) => europa as number,
        color: "#ff7f0e",
        label: "Europa",
      },
      { field: ({ asia }) => asia as number, color: "#2ca02c", label: "Asia" },
    ],
  },
  {
    margin: { top: 20, right: 40, bottom: 25, left: 25 },
    transitionTime: 6000,
  }
);

chart.renderXAxis("%d %b");
chart.renderYAxis();
chart.renderSeries();
chart.renderLegend();
chart.renderChartTitle("Sales and Cost Over Time");
chart.renderYAxisLabel("Sales");
chart.renderXAxisLabel("Date");
chart.renderCursor();
```

This code creates a time series chart. It sets up the data, initializes the chart, and renders the axes, series, legend, and labels.

## Creating a Custom Scatter Plot

1. Create a new TypeScript file called `scatter.ts` and add the following code:

```ts
import { select } from "d3";
import { CustomScatterChart } from "vizible-cartesian";

const data = [
  { x: 1, y: 2, z: 4 },
  { x: 2, y: 3, z: 5 },
  { x: 3, y: 5, z: 6 },
  { x: 4, y: 7, z: 8 },
];

const svg = document!.querySelector("svg") as SVGSVGElement;
const selection = select(svg);
const chart = new CustomScatterChart(selection, data,  {
  xSerie: { field: ({ x }) => x as number, label: "X Axis" },
  ySeries: [
    // No icon key is used, a circle will be displayed
    { field: ({ y }) => y as number, label: "Y Axis", color: "steelblue" },
    {
      field: ({ z }) => z as number,
      label: "Z Axis",
        color: "orange",
        // The icon will draw a heart shape
        icon: "M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z",
        size: 0.6,
      },
    ],
  },
);

chart.renderSeries();
chart.renderYAxis();
chart.renderXAxis();
chart.renderLegend(20, { x: 600, y: 20 });
```

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
