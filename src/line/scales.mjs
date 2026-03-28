"use strict";
import { scaleLinear, scalePow, scaleLog, scaleTime } from "d3";

const SCALE_FACTORIES = {
  linear: () => scaleLinear(),
  pow: (exp = 2) => scalePow().exponent(exp),
  log: () => scaleLog(),
  time: () => scaleTime(),
};

/**
 * Creates and configures x and y scales for a Cartesian chart.
 *
 * @param {Object} options - Configuration options for scale creation
 * @param {number[]} options.xDomain - The domain values for the x scale [min, max]
 * @param {number[]} options.yDomain - The domain values for the y scale [min, max]
 * @param {number} options.innerWidth - The width of the chart area in pixels
 * @param {number} options.innerHeight - The height of the chart area in pixels
 * @param {string} [options.xType="linear"] - The type of x scale (e.g., "linear", "log", "pow")
 * @param {string} [options.yType="linear"] - The type of y scale (e.g., "linear", "log", "pow")
 * @param {number} [options.xExponent=2] - The exponent for power scales on the x axis
 * @param {number} [options.yExponent=2] - The exponent for power scales on the y axis
 * @returns {Object} An object containing configured scale functions
 * @returns {Function} returns.xScale - The configured x scale function
 * @returns {Function} returns.yScale - The configured y scale function
 */
export const createScales = ({
  xDomain,
  yDomain,
  innerWidth,
  innerHeight,
  xType = "linear",
  yType = "linear",
  xExponent = 2,
  yExponent = 2,
}) => {
  const xScale = (SCALE_FACTORIES[xType] ?? SCALE_FACTORIES.linear)(xExponent)
    .domain(xDomain)
    .range([0, innerWidth])
    .nice();

  const yScale = (SCALE_FACTORIES[yType] ?? SCALE_FACTORIES.linear)(yExponent)
    .domain(yDomain)
    .range([innerHeight, 0])
    .nice();

  return { xScale, yScale };
};
