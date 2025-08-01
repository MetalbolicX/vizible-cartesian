# Tutorials

## Basic Usage of `vizible-cartesian` Create a Time Series Chart

In this tutorial, you'll learn how to create a basic time series chart using the `vizible-cartesian` library and D3.js. Each step is explained clearly and simply.

### Set Up Your Project 🛠️

Before you start coding, make sure you have a project set up. If you haven't already, follow the Getting Started guide to create a new project using Vite or your preferred setup.

#### Create the HTML File 📝

Create an `index.html` file in the root of your project. This file will serve as the container for your chart.

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

The `<svg>` element is where your chart will be drawn. The script tag loads your TypeScript code 🖼️.

#### Write the Time Series Chart Code in TypeScript 📊

Create a new file called `time.ts`. This file will load your data, set up the chart, and render it.

```ts
import { select, tsv } from "d3";
import { TimeChart } from "vizible-cartesian";

// Parse each row of the data file
const parseRow = (row) => {
  row.date = new Date(row.date);
  row.america = parseFloat(row.america);
  row.europa = parseFloat(row.europa);
  row.asia = parseFloat(row.asia);
  return row;
};

// Load the data from a remote TSV file
const data = await tsv(
  "https://raw.githubusercontent.com/Apress/create-web-charts-w-d3/refs/heads/master/D3Charts/charts_local/data_02.tsv",
  parseRow
);

const svg = document!.querySelector("svg") as SVGSVGElement;
const selection = select(svg);

// Create the chart with configuration
const chart = new TimeChart(
  selection,
  data,
  {
    xSerie: { field: ({ date }) => date as Date, label: "Date" },
    ySeries: [
      { field: ({ america }) => america as number, color: "#1f77b4", label: "America" },
      { field: ({ europa }) => europa as number, color: "#ff7f0e", label: "Europa" },
      { field: ({ asia }) => asia as number, color: "#2ca02c", label: "Asia" },
    ],
  },
  {
    margin: { top: 20, right: 40, bottom: 25, left: 25 },
    transitionTime: 6000,
  }
);

// Render the chart elements
chart.renderXAxis("%d %b");
chart.renderYAxis();
chart.renderSeries();
chart.renderLegend();
chart.renderChartTitle("Sales and Cost Over Time");
chart.renderYAxisLabel("Sales");
chart.renderXAxisLabel("Date");
chart.renderCursor();
```

**What does this code do?**

- Loads time series data from a TSV file.
- Sets up the chart with three series: America, Europa, and Asia.
- Renders axes, lines, a legend, and labels for a complete chart.
- Adds a cursor for interactive exploration 🕵️.

#### See Your Chart in Action! 🚀

Open your `index.html` file in a browser. You should see a colorful time series chart, with each line representing a different region. Hover over the chart to explore the data with the interactive cursor.

You've created your first time series chart using D3.js and `vizible-cartesian`. This chart is a solid foundation for exploring more advanced visualizations. As you continue learning, try changing the data, colors, or labels to make the chart your own.

## Working with Other Libraries

### Server-Side Rendering with D3Snap

For developers who want to generate charts on the server—perhaps for static sites, PDFs, or emails—server-side rendering is a valuable technique. In this section, you'll learn how to create a custom scatter plot using `vizible-cartesian` and render it server-side with the help of the [`D3Snap`](https://www.npmjs.com/package/d3-snap) library.

#### Install the Required Packages 🛠

<!-- tabs:start -->

#### **npm**

```sh
npm i d3 vizible-cartesian d3-snap
```

#### **pnpm**

```sh
pnpm add d3 vizible-cartesian d3-snap
```

#### **yarn**

```sh
yarn add d3 vizible-cartesian d3-snap
```

#### **bun**

```sh
bun add d3 vizible-cartesian d3-snap
```

#### **deno**

```sh
deno add --npm d3 vizible-cartesian d3-snap
```

<!-- tabs:end -->

This will provide you with all the tools needed for both chart creation and server-side SVG rendering.

#### Create the Custom Scatter Plot and Prepare your Data 📊

Start by importing the necessary modules in your TypeScript file. For this example, you'll use the CustomScatterChart from vizible-cartesian and the D3Snap class for server-side SVG creation.

```ts
import { D3Snap } from "d3-snap";
import { CustomScatterChart } from "vizible-cartesian";
import { select } from "d3";
```

Next, define your data. Here, each data point has `x`, `y`, and `z` values, with `z` being visualized using a custom heart-shaped icon ❤.

```ts
const data = [
  { x: 1, y: 2, z: 4 },
  { x: 2, y: 3, z: 5 },
  { x: 3, y: 5, z: 6 },
  { x: 4, y: 7, z: 8 },
];
```

#### Create the Server-Side SVG Context 🖥️

With D3Snap, you can create an SVG element entirely in Node.js (or any server environment). This SVG can then be passed to your chart for rendering.

```ts
const node = new D3Snap();
const svg = node.createSVG(800, 600);
const selection = select(svg);
```

#### Build and Render the Custom Scatter Plot 🎨

Now, instantiate the `CustomScatterChart` and render it into the server-side SVG context. You can specify custom icons, colors, and labels for each series.

```ts
const chart = new CustomScatterChart(selection, data, {
  xSerie: { field: ({ x }) => x as number, label: "X Axis" },
  ySeries: [
    // The first series uses a default circle icon
    { field: ({ y }) => y as number, label: "Y Axis", color: "steelblue" },
    // The second series uses a heart-shaped icon
    {
      field: ({ z }) => z as number,
      label: "Z Axis",
      color: "orange",
      icon: "M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z",
      size: 0.6,
    },
  ],
});

chart.renderSeries();
chart.renderYAxis();
chart.renderXAxis();
chart.renderLegend(20, { x: 600, y: 20 });
```

#### Output the SVG for Use Anywhere 📄

Once the chart is rendered, you can access the SVG markup as a string. This can be saved to a file, sent in an HTTP response, or embedded in a static site.

```ts
console.log("Chart HTML:\n", node.html);
```

This approach allows you to generate beautiful, consistent charts on the server, making it easy to automate reporting, create static documentation, or support environments where client-side JavaScript is not available 📝.

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
