"use strict";
import { line } from "d3";

/**
 * Renders or updates a line within a bounds group using D3 selection.
 *
 * @param {Object} boundsGroup - D3 selection object of the bounds group.
 * @param {Array} validData - Array of data points to be plotted.
 * @param {Object} xScale - D3 scale for the X-axis.
 * @param {Object} yScale - D3 scale for the Y-axis.
 * @param {Function} xAccessor - Function to access the X value from a data point.
 * @param {Function} yAccessor - Function to access the Y value from a data point.
 * @param {Object} [options] - Configuration options for the line.
 * @param {string} [options.stroke="steelblue"] - Stroke color of the line.
 * @param {number} [options.strokeWidth=2] - Stroke width of the line.
 * @returns {Object} D3 selection object of the rendered line.
 */

export const renderLine = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  { stroke = "steelblue", strokeWidth = 2 } = {}
) => {
  const pathGenerator = line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  boundsGroup
    .selectAll("path.chart-line")
    .data([validData])
    .join("path")
    .attr("class", "chart-line")
    .attr("d", pathGenerator)
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");
};
