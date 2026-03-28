"use strict";
import { data as rawData } from "./data.mjs";
import { getDimensions } from "./layout.mjs";
import { processNumericData, getExtents } from "./dataUtils.mjs";
import { createScales } from "./scales.mjs";
import { observeResize } from "./responsiveness.mjs";
import {
  renderSVG,
  renderBoundsGroup,
  renderXAxis,
  renderYAxis,
  renderLine,
  renderPoints,
  renderXAxisLabel,
  renderYAxisLabel,
  renderTitle,
} from "./components/index.mjs";
import { addTooltip, addZoomPan } from "./interactivity/index.mjs";

const MARGINS = { top: 50, right: 60, bottom: 70, left: 55 };
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
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
      boundedWidth: dims.boundedWidth,
      boundedHeight: dims.boundedHeight,
    });

    // Static structure
    const svg = renderSVG(container, { background: "#fafafa" });
    const bounds = renderBoundsGroup(svg, MARGINS);

    // Axes
    renderXAxis(bounds, xScale, dims.boundedHeight);
    renderYAxis(bounds, yScale);

    // Visuals
    renderLine(bounds, validData, xScale, yScale, xAccessor, yAccessor, {
      stroke: "steelblue",
    });
    renderPoints(bounds, validData, xScale, yScale, xAccessor, yAccessor, {
      fill: "steelblue",
    });

    // Labels & title
    renderXAxisLabel(svg, { ...dims, label: "X Value" });
    renderYAxisLabel(svg, { ...dims, label: "Y Value" });
    renderTitle(svg, { ...dims, title: "Numeric X/Y Chart" });

    // Interactivity
    addTooltip(bounds, validData, xScale, yScale, xAccessor, yAccessor, {
      boundedWidth: dims.boundedWidth,
      boundedHeight: dims.boundedHeight,
    });

    addZoomPan(svg, {
      xScale,
      yScale,
      boundedWidth: dims.boundedWidth,
      boundedHeight: dims.boundedHeight,
      onZoom: (newX, newY) => {
        renderXAxis(bounds, newX, dims.boundedHeight);
        renderYAxis(bounds, newY);
        renderLine(bounds, validData, newX, newY, xAccessor, yAccessor, {
          stroke: "steelblue",
        });
        renderPoints(bounds, validData, newX, newY, xAccessor, yAccessor, {
          fill: "steelblue",
        });
      },
    });
  };

  render();
  observeResize(container, render);
};
