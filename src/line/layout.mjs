"use strict";

/**
 * Calculates and returns dimensions for a chart container including margins
 * @param {HTMLElement} container - The DOM element containing the chart
 * @param {Object} margins - The margin values for the chart
 * @param {number} margins.left - Left margin in pixels
 * @param {number} margins.right - Right margin in pixels
 * @param {number} margins.top - Top margin in pixels
 * @param {number} margins.bottom - Bottom margin in pixels
 * @returns {Object} An object containing dimension information
 * @returns {number} returns.width - The full width of the container
 * @returns {number} returns.height - The full height of the container
 * @returns {number} returns.boundedWidth - The width minus left and right margins
 * @returns {number} returns.boundedHeight - The height minus top and bottom margins
 * @returns {Object} returns.margins - The margins object passed as parameter
 */
export const getDimensions = (container, margins) => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  return {
    width,
    height,
    boundedWidth: Math.max(0, width - margins.left - margins.right),
    boundedHeight: Math.max(0, height - margins.top - margins.bottom),
    margins,
  };
};
