"use strict";
import { axisBottom } from "d3";

/**
 * Renders or updates the X-axis within a bounds group using D3 selection.
 *
 * @param {Object} boundsGroup - D3 selection object of the bounds group.
 * @param {Object} xScale - D3 scale for the X-axis.
 * @param {number} boundedHeight - Height of the bounded area for positioning the axis.
 * @param {Object} [options] - Configuration options for the X-axis.
 * @param {number} [options.tickCount=5] - Number of ticks on the X-axis.
 * @param {Function} [options.tickFormat] - Custom tick format function.
 * @returns {Object} D3 selection object of the rendered X-axis.
 */

export const renderXAxis = (
  boundsGroup,
  xScale,
  boundedHeight,
  { tickCount = 5, tickFormat } = {},
) => {
  const axis = axisBottom(xScale).ticks(tickCount);
  if (tickFormat) axis.tickFormat(tickFormat);

  boundsGroup
    .selectAll("g.x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${boundedHeight})`)
    .call(axis);
};
