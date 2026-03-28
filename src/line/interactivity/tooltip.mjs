"use strict";
import { pointer, bisector } from "d3";

/**
 * Adds an interactive tooltip to a chart group that follows the mouse and displays
 * the nearest data point's x/y values.
 *
 * This function:
 * - Ensures a tooltip layer (groups, line, dot, tooltip box, and background text)
 *   exists inside the provided boundsGroup.
 * - Adds an invisible mouse-capture rect that listens for mousemove/mouseleave.
 * - On mousemove, uses a bisector on the provided validData and xAccessor to
 *   locate the nearest datum to the pointer, positions a vertical cursor line and
 *   a dot on the line, updates formatted x/y text, sizes the tooltip background,
 *   and positions the tooltip so it remains inside the provided inner bounds.
 * - On mouseleave, hides cursor and tooltip elements.
 *
 * Notes:
 * - validData should be sorted by the x value (ascending) so the bisector works correctly.
 * - xScale must provide an invert(value) method (e.g., linear or time scales).
 *
 * @param {d3.Selection} boundsGroup - D3 selection of the container <g> where tooltip elements are appended.
 * @param {Array<Object>} validData - Array of data objects (sorted by x) used to find the nearest point.
 * @param {Object} xScale - D3 scale mapping data x -> pixel x and providing invert(pixelX) -> data x.
 * @param {Object} yScale - D3 scale mapping data y -> pixel y.
 * @param {Function} xAccessor - Function(d) => x value from a datum.
 * @param {Function} yAccessor - Function(d) => y value from a datum.
 * @param {Object} [options] - Optional configuration.
 * @param {number} options.innerWidth - Inner drawing width in pixels (used to constrain tooltip).
 * @param {number} options.innerHeight - Inner drawing height in pixels (used for cursor line length).
 * @param {Function} [options.formatX=String] - Formatter for displayed x values (receives xAccessor(d)).
 * @param {Function} [options.formatY=String] - Formatter for displayed y values (receives yAccessor(d)).
 * @returns {void}
 */
export const addTooltip = (
  boundsGroup,
  validData,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  { innerWidth, innerHeight, formatX = String, formatY = String } = {},
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
    .attr("y2", innerHeight)
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
    .attr("width", innerWidth)
    .attr("height", innerHeight)
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

      const textW =
        Math.max(
          textX.node().getComputedTextLength(),
          textY.node().getComputedTextLength(),
        ) + PAD;

      tooltipBg.attr("width", textW).attr("height", BOX_H);

      const bx = cx + 10 + textW > innerWidth ? cx - textW - 10 : cx + 10;
      const by = Math.max(0, cy - BOX_H / 2);

      tooltipGroup
        .attr("transform", `translate(${bx},${by})`)
        .attr("display", null);
    })
    .on("mouseleave", () => {
      cursorLine.attr("display", "none");
      cursorDot.attr("display", "none");
      tooltipGroup.attr("display", "none");
    });
};
