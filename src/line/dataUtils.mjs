"use strict";
import { extent } from "d3";

/**
 * Determine whether a value can be treated as a finite numeric value.
 *
 * The input is coerced via Number() and then checked to ensure it is not NaN
 * and is finite. This will return true for numeric types and numeric strings
 * that convert to a finite number, and false for null, undefined, NaN,
 * Infinity, and values that do not coerce to a finite numeric value.
 *
 * @param {*} v - The value to validate as a number.
 * @returns {boolean} True if the value coerces to a finite number; otherwise false.
 *
 * @example
 * isValidNumber(42);       // true
 * isValidNumber("3.14");   // true
 * isValidNumber(null);     // false
 * isValidNumber("abc");    // false
 * isValidNumber(Infinity); // false
 */
const isValidNumber = (v) =>
  v !== null &&
  v !== undefined &&
  !Number.isNaN(Number(v)) &&
  isFinite(Number(v));

/**
 * Filters an array of data items to include only those where both x and y accessors
 * return valid numbers (as defined by `isValidNumber`).
 *
 * @template T
 * @param {T[]} rawData - The input array of data items.
 * @param {(d: T) => number} xAccessor - Function to extract the x value from an item.
 * @param {(d: T) => number} yAccessor - Function to extract the y value from an item.
 * @returns {T[]} Filtered array containing only items with valid numeric x and y values.
 */
export const processNumericData = (rawData, xAccessor, yAccessor) =>
  rawData.filter(
    (d) => isValidNumber(xAccessor(d)) && isValidNumber(yAccessor(d)),
  );

/**
 * Calculate numeric x and y domains (extents) from an array of data using the provided accessors.
 *
 * @param {Array<any>} validData - Array of data records to compute extents from.
 * @param {(d: any) => any} xAccessor - Accessor that returns the x value for a datum; values are coerced to Number.
 * @param {(d: any) => any} yAccessor - Accessor that returns the y value for a datum; values are coerced to Number.
 * @returns {{ xDomain: [number, number] | undefined, yDomain: [number, number] | undefined }} An object containing xDomain and yDomain as [min, max] numeric pairs, or undefined if an extent cannot be determined.
 */
export const getExtents = (validData, xAccessor, yAccessor) => ({
  xDomain: extent(validData, (d) => Number(xAccessor(d))),
  yDomain: extent(validData, (d) => Number(yAccessor(d))),
});
