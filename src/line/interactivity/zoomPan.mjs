"use strict";
import { zoom } from "d3";

/**
 * Adds zoom and pan functionality to an SVG element using D3.
 *
 * @param {Object} svg - D3 selection object of the SVG element.
 * @param {Object} options - Configuration options for zoom and pan.
 * @param {Object} options.xScale - D3 scale for the X-axis.
 * @param {Object} options.yScale - D3 scale for the Y-axis.
 * @param {number} options.innerWidth - Width of the bounded area for zooming.
 * @param {number} options.innerHeight - Height of the bounded area for zooming.
 * @param {Function} options.onZoom - Callback function invoked on zoom events.
 * @returns {Object} D3 zoom behavior object with an added reset helper.
 */

export const addZoomPan = (
  svg,
  { xScale, yScale, innerWidth, innerHeight, onZoom },
) => {
  const zoomBehavior = zoom()
    .scaleExtent([0.5, 32])
    .extent([
      [0, 0],
      [innerWidth, innerHeight],
    ])
    .on("zoom", (event) => {
      const { transform: t } = event;
      onZoom(t.rescaleX(xScale), t.rescaleY(yScale));
    });

  svg.call(zoomBehavior);

  // Expose a reset helper on the returned behavior
  zoomBehavior.reset = () => svg.call(zoomBehavior.transform, zoom().transform);

  return zoomBehavior;
};
