"use strict";

/**
 * Observes changes to the size of a container element and triggers a callback when resizing occurs.
 * @param {HTMLElement} container - The container element to observe for resize events.
 * @param {Function} renderCallback - The callback function to invoke when the container is resized.
 * @returns {Function} A cleanup function that disconnects the ResizeObserver when called.
 */
export const observeResize = (container, renderCallback) => {
  const observer = new ResizeObserver(() => renderCallback());
  observer.observe(container);
  return () => observer.disconnect();
};
