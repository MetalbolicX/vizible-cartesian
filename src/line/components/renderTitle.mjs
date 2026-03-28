"use strict";

/**
 * Renders or updates the chart title within an SVG element using D3 selection.
 *
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} options - Configuration options for the chart title.
 * @param {number} options.width - Width of the SVG element.
 * @param {Object} options.margins - Margins of the SVG element.
 * @param {string} options.title - Text for the chart title.
 * @param {number} [options.fontSize=16] - Font size of the title.
 * @param {string} [options.fill="#222"] - Fill color of the title.
 * @param {string} [options.fontWeight="bold"] - Font weight of the title.
 * @returns {Object} D3 selection object of the rendered chart title.
 */

export const renderTitle = (
  svg,
  { width, margins, title, fontSize = 16, fill = "#222", fontWeight = "bold" },
) =>
  svg
    .selectAll("text.chart-title")
    .data([null])
    .join("text")
    .attr("class", "chart-title")
    .attr("x", margins.left + (width - margins.left - margins.right) / 2)
    .attr("y", margins.top / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", fontSize)
    .attr("font-weight", fontWeight)
    .attr("fill", fill)
    .text(title);
