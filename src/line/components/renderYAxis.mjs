"use strict";
import { axisLeft } from "d3";

/**
 * Renders or updates the Y-axis within a bounds group using D3 selection.
 *
 * @param {Object} boundsGroup - D3 selection object of the bounds group.
 * @param {Object} yScale - D3 scale for the Y-axis.
 * @param {Object} [options] - Configuration options for the Y-axis.
 * @param {number} [options.tickCount=5] - Number of ticks on the Y-axis.
 * @param {Function} [options.tickFormat] - Custom tick format function.
 * @returns {Object} D3 selection object of the rendered Y-axis.
 */

export const renderYAxis = (boundsGroup, yScale, { tickCount = 5, tickFormat } = {}) => {
  const axis = axisLeft(yScale).ticks(tickCount);
  if (tickFormat) axis.tickFormat(tickFormat);

  boundsGroup
    .selectAll("g.y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(axis);
};
