"use strict";
import { scaleLinear, scalePow, scaleLog, scaleTime } from "d3";

const SCALE_FACTORIES = {
  linear: () => scaleLinear(),
  pow: (exp = 2) => scalePow().exponent(exp),
  log: () => scaleLog(),
  time: () => scaleTime(),
};

/**
 * Create X and Y scales for mapping data domains to pixel ranges.
 *
 * @param {Object} options - Options for scale creation.
 * @param {[number, number]|[Date, Date]} options.xDomain - Two-element array specifying the input domain for the X scale.
 * @param {[number, number]|[Date, Date]} options.yDomain - Two-element array specifying the input domain for the Y scale.
 * @param {number} options.innerWidth - Width of the inner drawing area in pixels; X range will be [0, innerWidth].
 * @param {number} options.innerHeight - Height of the inner drawing area in pixels; Y range will be [innerHeight, 0].
 * @param {string} [options.xType="linear"] - Identifier for the X scale factory to use (e.g. "linear", "log", "pow"); unknown types fall back to a linear factory.
 * @param {string} [options.yType="linear"] - Identifier for the Y scale factory to use; unknown types fall back to a linear factory.
 * @param {number} [options.xExponent=2] - Exponent parameter passed to the X scale factory (used by power scales).
 * @param {number} [options.yExponent=2] - Exponent parameter passed to the Y scale factory (used by power scales).
 * @returns {{ xScale: Function, yScale: Function }} An object with `xScale` and `yScale` functions. Each returned scale is a chainable scale-like function (supports methods such as .domain(), .range(), and .nice()) that maps domain values to pixel coordinates.
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
