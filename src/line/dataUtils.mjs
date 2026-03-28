"use strict";
import { extent } from "d3";

/**
 * Validates whether a value is a valid, finite number.
 *
 * Checks that the value is not null, undefined, NaN, or infinite.
 *
 * @param {*} v - The value to validate
 * @returns {boolean} True if the value is a valid finite number, false otherwise
 * @example
 * isValidNumber(42)        // true
 * isValidNumber("42")      // true
 * isValidNumber(null)      // false
 * isValidNumber(undefined) // false
 * isValidNumber(NaN)       // false
 * isValidNumber(Infinity)  // false
 */
const isValidNumber = (v) =>
  v !== null && v !== undefined && !Number.isNaN(Number(v)) && isFinite(Number(v));

/**
 * Processes raw data by filtering out invalid numeric values.
 * @param {Array} rawData - The raw dataset to process
 * @param {Function} xAccessor - Function to extract the x-value from each data point
 * @param {Function} yAccessor - Function to extract the y-value from each data point
 * @returns {Array} Filtered array containing only data points with valid numeric x and y values
 */
export const processNumericData = (rawData, xAccessor, yAccessor) =>
  rawData.filter((d) => isValidNumber(xAccessor(d)) && isValidNumber(yAccessor(d)));

/**
 * Calculates the domain extents for X and Y axes based on the provided data.
 *
 * @param {Array} validData - An array of data objects to calculate extents from
 * @param {Function} xAccessor - A function that extracts the X value from a data object
 * @param {Function} yAccessor - A function that extracts the Y value from a data object
 * @returns {Object} An object containing xDomain and yDomain arrays [min, max] for each axis
 * @returns {Array} returns.xDomain - The [min, max] extent for the X axis
 * @returns {Array} returns.yDomain - The [min, max] extent for the Y axis
 */
export const getExtents = (validData, xAccessor, yAccessor) => ({
  xDomain: extent(validData, (d) => Number(xAccessor(d))),
  yDomain: extent(validData, (d) => Number(yAccessor(d))),
});
