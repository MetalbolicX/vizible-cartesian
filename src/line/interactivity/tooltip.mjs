"use strict";
import { pointer, bisector } from "d3";

/**
 * Adds an interactive tooltip to a D3 chart that displays data values on mouseover.
 *
 * The tooltip includes a vertical cursor line, a dot at the data point, and a box
 * displaying formatted X and Y values. The tooltip follows the mouse and intelligently
 * positions itself to avoid going off the right edge of the chart.
 *
 * @param {d3.Selection} boundsGroup - D3 selection of the bounds group container
 * @param {Array} validData - Array of data objects to display in the tooltip
 * @param {d3.ScaleLinear} xScale - D3 scale for X axis
 * @param {d3.ScaleLinear} yScale - D3 scale for Y axis
 * @param {Function} xAccessor - Function to extract X value from data object
 * @param {Function} yAccessor - Function to extract Y value from data object
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.boundedWidth] - Width of the chart bounds in pixels
 * @param {number} [options.boundedHeight] - Height of the chart bounds in pixels
 * @param {Function} [options.formatX=String] - Function to format X values for display
 * @param {Function} [options.formatY=String] - Function to format Y values for display
 * @returns {void}
 */
export const addTooltip = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  { boundedWidth, boundedHeight, formatX = String, formatY = String } = {}
) => {
  const bisect = bisector(xAccessor).center;

  const tooltipLayer = boundsGroup
    .selectAll("g.tooltip-layer")
    .data([null])
    .join("g")
    .attr("class", "tooltip-layer");

  const cursorLine = tooltipLayer
    .selectAll("line.cursor-line")
    .data([null])
    .join("line")
    .attr("class", "cursor-line")
    .attr("y1", 0)
    .attr("y2", boundedHeight)
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 3")
    .attr("pointer-events", "none")
    .attr("display", "none");

  const cursorDot = tooltipLayer
    .selectAll("circle.cursor-dot")
    .data([null])
    .join("circle")
    .attr("class", "cursor-dot")
    .attr("r", 5)
    .attr("fill", "steelblue")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("pointer-events", "none")
    .attr("display", "none");

  const tooltipGroup = tooltipLayer
    .selectAll("g.tooltip-box")
    .data([null])
    .join("g")
    .attr("class", "tooltip-box")
    .attr("pointer-events", "none")
    .attr("display", "none");

  const tooltipBg = tooltipGroup
    .selectAll("rect.tooltip-bg")
    .data([null])
    .join("rect")
    .attr("class", "tooltip-bg")
    .attr("rx", 4)
    .attr("fill", "white")
    .attr("stroke", "#ddd")
    .attr("stroke-width", 1)
    .style("filter", "drop-shadow(0 1px 4px rgba(0,0,0,0.12))");

  const textX = tooltipGroup
    .selectAll("text.tip-x")
    .data([null])
    .join("text")
    .attr("class", "tip-x")
    .attr("x", 8)
    .attr("y", 15)
    .attr("font-size", 11)
    .attr("fill", "#666");

  const textY = tooltipGroup
    .selectAll("text.tip-y")
    .data([null])
    .join("text")
    .attr("class", "tip-y")
    .attr("x", 8)
    .attr("y", 30)
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("fill", "#222");

  const PAD = 16;
  const BOX_H = 42;

  boundsGroup
    .selectAll("rect.mouse-capture")
    .data([null])
    .join("rect")
    .attr("class", "mouse-capture")
    .attr("width", boundedWidth)
    .attr("height", boundedHeight)
    .attr("fill", "transparent")
    .on("mousemove", (event) => {
      const [mx] = pointer(event);
      const idx = bisect(validData, xScale.invert(mx));
      const d = validData[Math.max(0, Math.min(idx, validData.length - 1))];
      if (!d) return;

      const cx = xScale(xAccessor(d));
      const cy = yScale(yAccessor(d));

      cursorLine.attr("x1", cx).attr("x2", cx).attr("display", null);
      cursorDot.attr("cx", cx).attr("cy", cy).attr("display", null);

      textX.text(`x: ${formatX(xAccessor(d))}`);
      textY.text(`y: ${formatY(yAccessor(d))}`);

      const textW = Math.max(
        textX.node().getComputedTextLength(),
        textY.node().getComputedTextLength()
      ) + PAD;

      tooltipBg.attr("width", textW).attr("height", BOX_H);

      const bx = cx + 10 + textW > boundedWidth ? cx - textW - 10 : cx + 10;
      const by = Math.max(0, cy - BOX_H / 2);

      tooltipGroup.attr("transform", `translate(${bx},${by})`).attr("display", null);
    })
    .on("mouseleave", () => {
      cursorLine.attr("display", "none");
      cursorDot.attr("display", "none");
      tooltipGroup.attr("display", "none");
    });
};
