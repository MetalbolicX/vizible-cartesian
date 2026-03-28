"use strict";
import { data as rawData } from "./data.mjs";
import { getDimensions } from "./layout.mjs";
import { processNumericData, getExtents } from "./dataUtils.mjs";
import { createScales } from "./scales.mjs";
import { observeResize } from "./responsiveness.mjs";
import {
  renderBoundsGroup,
  renderLegend,
  renderLine,
  renderPoints,
  renderSVG,
  renderTitle,
  renderXAxis,
  renderXAxisLabel,
  renderYAxis,
  renderYAxisLabel,
} from "./components/index.mjs";
import { addTooltip, addZoomPan } from "./interactivity/index.mjs";

const MARGINS = { top: 50, right: 60, bottom: 70, left: 55 };
const xAccessor = ({ x }) => x;
const yAccessor = ({ y }) => y;
const validData = processNumericData(rawData, xAccessor, yAccessor);

/**
 * Entrypoint function to render the line chart within a specified container element.
 * @param {*} container - The DOM element that will contain the rendered chart. The function sets up the entire chart including scales, axes, line and points rendering, labels, title, and interactivity features like tooltips and zoom/pan. It also observes container resizing to re-render the chart responsively.
 */
export const main = (container) => {
  const render = () => {
    const dims = getDimensions(container, MARGINS);
    const { xDomain, yDomain } = getExtents(validData, xAccessor, yAccessor);
    const { xScale, yScale } = createScales({
      xDomain,
      yDomain,
      innerWidth: dims.innerWidth,
      innerHeight: dims.innerHeight,
    });

    // Static structure
    const svg = renderSVG(container, { background: "#fafafa" });
    const bounds = renderBoundsGroup(svg, MARGINS);

    // Axes
    bounds
      .call(renderXAxis, xScale, dims.innerHeight)
      .call(renderYAxis, yScale, dims.innerWidth);

    // Visuals
    bounds
      .call(renderLine, validData, xScale, yScale, xAccessor, yAccessor, {
        stroke: "steelblue",
      })
      .call(renderPoints, validData, xScale, yScale, xAccessor, yAccessor, {
        fill: "steelblue",
      });

    // Labels & title
    svg
      .call(renderTitle, { ...dims, title: "Numeric X/Y Chart" })
      .call(renderXAxisLabel, { ...dims, label: "X Value" })
      .call(renderYAxisLabel, { ...dims, label: "Y Value" });
    // .call(renderLegend, { ...dims, legend: "f(x)" });

    // Interactivity
    bounds.call(addTooltip, validData, xScale, yScale, xAccessor, yAccessor, {
      innerWidth: dims.innerWidth,
      innerHeight: dims.innerHeight,
    });

    svg.call(addZoomPan, {
      xScale,
      yScale,
      innerWidth: dims.innerWidth,
      innerHeight: dims.innerHeight,
      onZoom: (newX, newY) => {
        bounds.call(renderXAxis, newX, dims.innerHeight);
        bounds.call(renderYAxis, newY, dims.innerWidth);
        bounds.call(renderLine, validData, newX, newY, xAccessor, yAccessor, {
          stroke: "steelblue",
        });
        bounds.call(renderPoints, validData, newX, newY, xAccessor, yAccessor, {
          fill: "steelblue",
        });
      },
    });
  };

  render();
  observeResize(container, render);
};
