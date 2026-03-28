"use strict";
/**
 * Renders or updates the X-axis label within an SVG element using D3 selection.
 *
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} options - Configuration options for the X-axis label.
 * @param {number} options.width - Width of the SVG element.
 * @param {number} options.height - Height of the SVG element.
 * @param {Object} options.margins - Margins of the SVG element.
 * @param {string} options.label - Text for the X-axis label.
 * @param {number} [options.fontSize=13] - Font size of the label.
 * @param {string} [options.fill="#555"] - Fill color of the label.
 * @returns {Object} D3 selection object of the rendered X-axis label.
 */
export const renderXAxisLabel = (svg, { width, height, margins, label, fontSize = 13, fill = "#555" }) =>
  svg
    .selectAll("text.x-label")
    .data([null])
    .join("text")
    .attr("class", "x-label")
    .attr("x", margins.left + (width - margins.left - margins.right) / 2)
    .attr("y", height - 4)
    .attr("text-anchor", "middle")
    .attr("font-size", fontSize)
    .attr("fill", fill)
    .text(label);

/**
 * Renders or updates the Y-axis label within an SVG element using D3 selection.
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} options - Configuration options for the Y-axis label.
 * @param {number} options.height - Height of the SVG element.
 * @param {Object} options.margins - Margins of the SVG element.
 * @param {string} options.label - Text for the Y-axis label.
 * @param {number} [options.fontSize=13] - Font size of the label.
 * @param {string} [options.fill="#555"] - Fill color of the label.
 * @returns {Object} D3 selection object of the rendered Y-axis label.
 */
export const renderYAxisLabel = (svg, { height, margins, label, fontSize = 13, fill = "#555" }) =>
  svg
    .selectAll("text.y-label")
    .data([null])
    .join("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margins.top + (height - margins.top - margins.bottom) / 2))
    .attr("y", 14)
    .attr("text-anchor", "middle")
    .attr("font-size", fontSize)
    .attr("fill", fill)
    .text(label);
