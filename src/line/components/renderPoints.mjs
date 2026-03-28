"use strict";

/**
 * Render point circles for a dataset inside a D3 group.
 *
 * Binds the provided data to circle elements, using the xAccessor as the key,
 * and updates/creates circles with position and styling based on the provided
 * scales, accessors, and options.
 *
 * @param {import("d3-selection").Selection<SVGGElement, any, any, any>} boundsGroup - D3 group selection to contain the points.
 * @param {Array<any>} validData - Array of data objects to render as points.
 * @param {Function} xScale - D3 scale function mapping x values to pixel coordinates.
 * @param {Function} yScale - D3 scale function mapping y values to pixel coordinates.
 * @param {Function} xAccessor - Function(d) => xValue; also used as the data key for join.
 * @param {Function} yAccessor - Function(d) => yValue.
 * @param {Object} [options] - Optional rendering options.
 * @param {number} [options.radius=4] - Circle radius in pixels.
 * @param {string} [options.fill="steelblue"] - Circle fill color.
 * @param {string} [options.stroke="white"] - Circle stroke color.
 * @param {number} [options.strokeWidth=1.5] - Circle stroke width.
 * @param {number} [options.opacity=0.85] - Circle opacity.
 * @returns {import("d3-selection").Selection<SVGCircleElement, any, any, any>} Selection of the rendered circle elements.
 */
export const renderPoints = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  {
    radius = 4,
    fill = "steelblue",
    stroke = "white",
    strokeWidth = 1.5,
    opacity = 0.85,
  } = {},
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
