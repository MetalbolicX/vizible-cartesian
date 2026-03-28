"use strict";
import { line, select } from "d3";

/**
 * Render a single line path into a given bounds group using provided scales and accessors.
 *
 * This function binds the provided data array as a single datum to a path.chart-line element
 * and manages enter, update, and exit lifecycle. On enter and update the path is drawn using
 * a d3 line generator and animated with a stroke-dasharray / stroke-dashoffset transition to
 * create a "drawing" effect. The path is created with no fill and configurable stroke, strokeWidth,
 * and transition duration. Exiting elements are removed.
 *
 * @param {import('d3-selection').Selection} boundsGroup - The container selection (typically a <g>)
 *   where the line path will be appended/updated.
 * @param {Array} validData - Array of data objects to be rendered as the line.
 * @param {Function} xScale - Scale function mapping x values to pixel coordinates.
 * @param {Function} yScale - Scale function mapping y values to pixel coordinates.
 * @param {Function} xAccessor - Accessor function: (d) => xValue for each datum.
 * @param {Function} yAccessor - Accessor function: (d) => yValue for each datum.
 * @param {Object} [options] - Optional configuration.
 * @param {string} [options.stroke='steelblue'] - Stroke color for the line.
 * @param {number} [options.strokeWidth=2] - Stroke width for the line.
 * @param {number} [options.transitionDuration=1000] - Transition duration in milliseconds for the draw animation.
 * @returns {import('d3-selection').Selection} The joined selection for the line path (enter/update/exit result).
 */
export const renderLine = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  { stroke = "steelblue", strokeWidth = 2, transitionDuration = 1000 } = {},
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
              .duration(transitionDuration)
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
            .duration(transitionDuration)
            .attr("d", pathGenerator)
            .attr("stroke", stroke)
            .attr("stroke-dashoffset", 0);
        }),
      (exit) => exit.remove(),
    );
};
