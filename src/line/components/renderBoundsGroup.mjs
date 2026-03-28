"use strict";
/**
 * Renders or updates a bounds group within an SVG element using D3 selection.
 *
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} margins - Margins to apply to the bounds group.
 * @param {number} margins.left - Left margin.
 * @param {number} margins.top - Top margin.
 * @returns {Object} D3 selection object of the rendered bounds group.
 */
export const renderBoundsGroup = (svg, margins) =>
  svg
    .selectAll("g.bounds")
    .data([null])
    .join("g")
    .attr("class", "bounds")
    .attr("transform", `translate(${margins.left},${margins.top})`);
