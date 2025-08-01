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

In this example, we'll create the tooltip using the [`TipViz`](https://www.npmjs.com/package/tipviz) web component, which couples well with D3.js visualizations.

Create the `index.html` file in the root of your project with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scatter Plot</title>
    <script type="module" src="scatter.ts"></script>
</head>
<body>
    <svg width="800" height="600"></svg>
    <tip-viz id="tooltip"></tip-viz>
</body>
</html>
```

Create a new TypeScript file called `scatter.ts` and add the following code. First, ensure you have the `tipviz` package installed, the package will be added at the top to register the custom element. Second, we will create a scatter chart using the `ScatterChart` class from `vizible-cartesian`.

```ts
import { select, tsv } from "d3";
import { ScatterChart } from "../src/index.ts";
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

Lets add the tooltip functionality to the scatter points. The `TipVizTooltip` allows to use templates to create the structure of the tooltip in the way you want and style it with CSS.

The `mouseover.tooltip` and `mouseout.tooltip` events will be used to show and hide the tooltip when hovering over the scatter points.

```ts
const tooltip = document!.querySelector<TipVizTooltip>("#tooltip");
if (!tooltip) {
  throw new Error("Tooltip element not found");
}

// Behind scenes, vizible-cartesian sets the object as { x: number, y: number } object
tooltip.setHtml(({ x, y }) =>
  /*html*/`
  <ul class="tooltip-content">
    <li>Time: ${x}</li>
    <li>Intensity: ${y}</li>
  </ul>
`.trim()
);

// Set styles for the tooltip content
tooltip.setStyles(/*css*/`
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
`.trim());

selection
  .selectAll(".scatter-point")
  .on("mouseover.tooltip", ({ target }, d) => {
    if (target.tagName !== "circle") return;
    tooltip.show(d as Record<string, { x: number; y: number }>, target);
  })
  .on("mouseout.tooltip", () => tooltip.hide())
```

The hover effect will reduce the opacity of the other points when hovering over a point of certain series, making it easier to focus on the hovered point. The `mouseover.hover` and `mouseout.hover` events will be used to add and remove the `highlight` class to the other points of the same series.

The `highlight` class will increase the opacity of the not hovered points of the same series to a certain value but not 1, except the point being hovered over.

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

To hide all points of the same series except the hovered one. We'll create a css file called `scatter.css`.

We are going to use the pseudo-class `:has()` to reduce the opacity of the points that are not hovered over. Moreover, we will use the `highlight` class to increase the opacity of not hovered points of the same series.

```css
.scatter-point {
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1; /* Full opacity on hovered point */
  }
}

/* Hide all points including all of the same category when a point is hovered */
.series:has(.scatter-point:hover) .scatter-point:not(:hover) {
  opacity: 0.2;
}

/** Increase opacity for all points with highlight class (same series) as the hovered point */
.series:has(.scatter-point:hover) .scatter-point.highlight {
  opacity: 0.75;
}
```

Finally, import the CSS file in the `index.html` file:

```html
<link rel="stylesheet" href="./scatter.css">
```
