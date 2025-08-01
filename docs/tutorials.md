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

This code creates a custom scatter plot with two series. The first series uses a circle icon because the icon key is not specified, while the second series uses a heart shape icon.

## Working with Other Libraries

### Server-Side Rendering with D3Snap

`vizible-cartesian` can be integrated with other libraries like [`D3Snap`](https://www.npmjs.com/package/d3-snap) which is a library to create server-side rendered D3 visualizations.

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

This code snippet demonstrates how to create a time series chart using `vizible-cartesian` and render it as an HTML string using `D3Snap`. The chart is created with sales and cost data, and the resulting SVG can be used in server-side rendering scenarios or a static chart snapshot.

### Creating a Scatter Plot with Hover Effects and Tooltips

Most developers working with data visualizations in JavaScript or TypeScript need to create interactive and visually appealing plots. 📊 In this tutorial, you'll learn how to use `visible-cartesian` to create a scatter plot and interactivity with hover effects and custom tooltips powered by the [`TipViz`](https://www.npmjs.com/package/tipviz) web component.

#### Setting Up the Project 🛠

To get started, create an `index.html` file in the root of your project. This file will serve as the entry point for your scatter plot visualization.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scatter Plot</title>
    <script type="module" src="scatter.ts"></script>
    <link rel="stylesheet" href="./scatter.css">
</head>
<body>
    <svg width="800" height="600"></svg>
    <tip-viz-tooltip id="tooltip"></tip-viz-tooltip>
    <script type="module" src="scatter.ts" lang="ts"></script>
</body>
</html>
```

This setup includes an SVG element for rendering the chart and a `<tip-viz-tooltip>` element for displaying tooltips. The CSS file will be used to style the scatter plot and tooltips 🎨.

#### Building the Scatter Plot 📈

Next, create a `scatter.ts` file where you'll implement the scatter plot logic using `vizible-cartesian`. This file will handle data loading, chart creation, and interactivity.

```ts
import { select, tsv } from "d3";
import { ScatterChart } from "vizible-cartesian";
import "tipviz"; // This side-effect import registers the custom element
import { type TipVizTooltip } from "tipviz"; // Help for TypeScript to recognize the custom element

const data = await tsv(
  "https://raw.githubusercontent.com/Apress/create-web-charts-w-d3/refs/heads/master/D3Charts/charts_CDN/data_09.tsv",
  (d) => ({
    time: parseInt(d.time, 10),
    intensity: Number(d.intensity),
    group: d.group,
  })
);

const svg = document!.querySelector("svg") as SVGSVGElement;
const selection = select(svg);

const chart = new ScatterChart(selection, data, {
  xSerie: { field: ({ time }) => time as number, label: "Time" },
  ySeries: [
    {
      field: ({ intensity }) => intensity as number,
      color: "#1f77b4",
      label: "Intensity",
      radii: 5,
    },
  ],
});

chart.renderSeries();
chart.renderYAxis();
chart.renderXAxis();
```

This code loads data from a remote TSV file, initializes the scatter chart, and renders the axes and data points 🚀.

#### Adding Tooltips 🖱️

To make your scatter plot more informative, let's add tooltips that appear when you hover over a data point. The `TipViz` web component makes this easy and customizable.

```ts
const tooltip = document!.querySelector<TipVizTooltip>("#tooltip");
if (!tooltip) {
  throw new Error("Tooltip element not found");
}

// Define the HTML structure for the tooltip
tooltip.setHtml(({ x, y }) =>
  `<ul class="tooltip-content">
    <li>Time: ${x}</li>
    <li>Intensity: ${y}</li>
  </ul>`
);

// Style the tooltip for better readability
tooltip.setStyles(`
  .tooltip-content {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    color: #333;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    padding: 0.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .tooltip-content li {
    margin-bottom: 0.3em;
  }
`);

// Show and hide the tooltip on hover
selection
  .selectAll(".scatter-point")
  .on("mouseover.tooltip", ({ target }, d) => {
    if (target.tagName !== "circle") return;
    tooltip.show(d as Record<string, { x: number; y: number }>, target);
  })
  .on("mouseout.tooltip", () => tooltip.hide());
```

With these additions, users can easily see detailed information about each data point by hovering over it 🧐.

> [!Warning]
> The `visible-cartesian` library creates a new object for each data point, so the `d` parameter is and object which keys are `x`,`y` and `label` to use with `TipViz` templating.

#### Adding Hover Effects for Better Focus 🎯

To help users focus on specific data points, you can add hover effects that adjust the opacity of other points in the same series.

```ts
selection
  .on("mouseover.hover", (evt) => {
    const target = evt.target as SVGCircleElement;
    if (!target.classList.contains("scatter-point")) return;
    const label = target.getAttribute("data-label");
    selection
      .selectAll<SVGCircleElement, Record<string, { x: number; y: number }>>(
        `.scatter-point[data-label="${label}"]`
      )
      .filter(function () {
        return this !== target;
      })
      .classed("highlight", true);
  })
  .on("mouseout.hover", () => {
    selection.selectAll(".scatter-point.highlight").classed("highlight", false);
  });
```

This effect dims other points in the same series, making the hovered point stand out 🌟.

#### Styling the Scatter Plot with CSS 🎨

Create a `scatter.css` file to style your scatter plot and tooltips. The following CSS uses the `:has()` pseudo-class and a `highlight` class for advanced hover effects:

```css
.scatter-point {
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s;
}
.scatter-point:hover {
  opacity: 1;
}
/* Dim all points except the hovered one in the same series */
.series:has(.scatter-point:hover) .scatter-point:not(:hover) {
  opacity: 0.2;
}
/* Slightly increase opacity for highlighted points in the same series */
.series:has(.scatter-point:hover) .scatter-point.highlight {
  opacity: 0.75;
}
```

This styling ensures your chart is both attractive and user-friendly 🎯.

By following these steps, you've created a dynamic scatter plot with D3.js and `vizible-cartesian`, enhanced with interactive tooltips and engaging hover effects using `TipViz` 🏆. These techniques not only improve the user experience but also make your data visualizations more insightful and professional.
