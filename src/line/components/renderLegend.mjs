"use strict";

/**
 * Renders or updates a legend within an SVG element using D3 selection.
 *
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} options - Configuration options for the legend.
 * @param {Array} options.items - Array of legend items, each with a label and color.
 * @param {number} [options.x=0] - X position of the legend.
 * @param {number} [options.y=0] - Y position of the legend.
 * @param {number} [options.fontSize=12] - Font size of the legend labels.
 * @param {number} [options.swatchSize=12] - Size of the color swatches.
 * @param {number} [options.gap=6] - Gap between legend entries.
 * @returns {Object} D3 selection object of the rendered legend.
 */
export const renderLegend = (
  svg,
  { items, x = 0, y = 0, fontSize = 12, swatchSize = 12, gap = 6 }
) => {
  const legendGroup = svg
    .selectAll("g.legend")
    .data([null])
    .join("g")
    .attr("class", "legend")
    .attr("transform", `translate(${x},${y})`);

  const rowHeight = swatchSize + gap;

  const entries = legendGroup
    .selectAll("g.legend-entry")
    .data(items)
    .join("g")
    .attr("class", "legend-entry")
    .attr("transform", (_, i) => `translate(0,${i * rowHeight})`);

  entries
    .selectAll("rect.swatch")
    .data((d) => [d])
    .join("rect")
    .attr("class", "swatch")
    .attr("width", swatchSize)
    .attr("height", swatchSize)
    .attr("rx", 2)
    .attr("fill", (d) => d.color);

  entries
    .selectAll("text.legend-label")
    .data((d) => [d])
    .join("text")
    .attr("class", "legend-label")
    .attr("x", swatchSize + gap)
    .attr("y", swatchSize / 2)
    .attr("dominant-baseline", "middle")
    .attr("font-size", fontSize)
    .attr("fill", "#333")
    .text((d) => d.label);
};
