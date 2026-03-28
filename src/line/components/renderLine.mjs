"use strict";
import { line, select } from "d3";

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
  { stroke = "steelblue", strokeWidth = 2 } = {},
) => {
  const pathGenerator = line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  return boundsGroup
    .selectAll("path.chart-line")
    .data([validData])
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "chart-line")
          .attr("fill", "none")
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("d", pathGenerator)
          .each(function () {
            const path = select(this);
            const totalLength = this.getTotalLength();
            path
              .attr("stroke-dasharray", totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .duration(1000)
              .attr("stroke-dashoffset", 0);
          }),
      (update) =>
        update.each(function () {
          const path = select(this);
          const totalLength = this.getTotalLength();
          path
            .attr("stroke-dasharray", totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(750)
            .attr("d", pathGenerator)
            .attr("stroke", stroke)
            .attr("stroke-dashoffset", 0);
        }),
      (exit) => exit.remove(),
    );
};
