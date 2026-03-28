"use strict";

/**
 * Render or update the X axis label inside the given SVG container.
 *
 * Centers the label horizontally between the left and right margins and
 * positions it near the bottom of the drawing area.
 *
 * @param {import('d3-selection').Selection<SVGSVGElement|SVGGElement, any, any, any>} svg - D3 selection to render the label into.
 * @param {Object} options - Configuration options.
 * @param {number} options.width - Total width of the drawing area (including margins).
 * @param {number} options.height - Total height of the drawing area (including margins).
 * @param {{ left: number, right: number }} options.margins - Margins object (must include left and right).
 * @param {string} options.label - Text content for the X axis label.
 * @param {number} [options.fontSize=13] - Font size for the label (pixels).
 * @param {string} [options.fill="#555"] - Fill color for the label text.
 * @returns {import('d3-selection').Selection<SVGTextElement, unknown, null, undefined>} The D3 selection for the created or updated text element.
 */
export const renderXAxisLabel = (
  svg,
  { width, height, margins, label, fontSize = 13, fill = "#555" },
) =>
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
 * Render or update a vertical Y-axis label inside an SVG selection.
 *
 * @param {import('d3-selection').Selection<SVGSVGElement|SVGGElement, any, any, any>} svg - D3 selection to render the label into.
 * @param {Object} options - Options for layout and styling.
 * @param {number} options.height - Total height of the chart area.
 * @param {{top:number,right:number,bottom:number,left:number}} options.margins - Chart margins used to position the label.
 * @param {string} options.label - Text content for the Y-axis label.
 * @param {number} [options.fontSize=13] - Font size for the label text.
 * @param {string} [options.fill="#555"] - Fill color for the label text.
 * @returns {import('d3-selection').Selection<SVGTextElement, any, any, any>} The D3 text selection for the rendered Y-axis label.
 */
export const renderYAxisLabel = (
  svg,
  { height, margins, label, fontSize = 13, fill = "#555" },
) =>
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
