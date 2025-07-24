import type { Selection } from "d3";
import type { SeriesOptions } from "./types.ts";

/**
 * Draws a legend for the given series options.
 * @param selection - The D3 selection to append the legend to.
 * @param series - Array of series options containing key, name, and color.
 * @param [x=20] - The x position of the legend.
 * @param [y=20] - The y position of the legend.
 * @param [itemHeight=20] - The height of each legend item.
 * @example
 * ```ts
 * drawLegend(d3.select("svg"), seriesData);
 * ```
 */
export const drawLegend = (
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  series: SeriesOptions[],
  x: number = 20,
  y: number = 20,
  itemHeight: number = 20
): void => {
  const legendGroup = selection
    .selectAll<SVGGElement, unknown>(".legend")
    .data([null])
    .join("g")
    .attr("class", "legend")
    .attr("transform", `translate(${x},${y})`);

  legendGroup.selectAll<SVGGElement, SeriesOptions>("g")
    .data(series)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (_, i) => `translate(0,${i * itemHeight})`)
    .call((group) => {
      group.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", ({ color }) => color ?? "steelblue");
      group.append("text")
        .attr("x", 22)
        .attr("y", 12)
        .text(({ name, key }) => name ?? key)
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");
    });
};
