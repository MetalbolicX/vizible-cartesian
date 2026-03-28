"use strict";
import { select } from "d3";

/**
 * Renders or updates an SVG element within a container using D3 selection.
 *
 * @param {HTMLElement} container - The DOM element that will contain the SVG.
 * @param {Object} options - Configuration options for the SVG rendering.
 * @param {string} [options.background="white"] - The background color of the SVG element.
 * @returns {Object} D3 selection object of the rendered SVG element.
 */
export const renderSVG = (container, { background = "white" } = {}) =>
  select(container)
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", container.clientWidth)
    .attr("height", container.clientHeight)
    .style("background", background)
    .style("overflow", "visible");
