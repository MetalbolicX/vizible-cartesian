"use strict";
/**
 * Renders or updates points within a bounds group using D3 selection.
 *
 * @param {Object} boundsGroup - D3 selection object of the bounds group.
 * @param {Array} validData - Array of data points to be plotted.
 * @param {Object} xScale - D3 scale for the X-axis.
 * @param {Object} yScale - D3 scale for the Y-axis.
 * @param {Function} xAccessor - Function to access the X value from a data point.
 * @param {Function} yAccessor - Function to access the Y value from a data point.
 * @param {Object} [options] - Configuration options for the points.
 * @param {number} [options.radius=4] - Radius of the points.
 * @param {string} [options.fill="steelblue"] - Fill color of the points.
 * @param {string} [options.stroke="white"] - Stroke color of the points.
 * @param {number} [options.strokeWidth=1.5] - Stroke width of the points.
 * @param {number} [options.opacity=0.85] - Opacity of the points.
 * @returns {Object} D3 selection object of the rendered points.
 */

export const renderPoints = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  { radius = 4, fill = "steelblue", stroke = "white", strokeWidth = 1.5, opacity = 0.85 } = {}
) =>
  boundsGroup
    .selectAll("circle.point")
    .data(validData, xAccessor)
    .join("circle")
    .attr("class", "point")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", radius)
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("opacity", opacity);
