import type { Selection } from "d3";
import type { SeriesOptions } from "../types.ts";

/**
 * Draws the x-axis label at the bottom right corner of the chart.
 * @param selection - The D3 selection to append the label to.
 * @param label - The label text.
 * @param width - The width of the chart.
 * @param height - The height of the chart.
 * @param margin - The margin object of the chart.
 */
export const drawXAxisLabel = (
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  label: string,
  margin: { left: number; right: number; top: number; bottom: number }
): void => {
  const width = selection.node()?.getBoundingClientRect().width || 0;
  const w = typeof width === "string" ? parseFloat(width) : width;
  const height = selection.node()?.getBoundingClientRect().height || 0;
  const h = typeof height === "string" ? parseFloat(height) : height;
  selection
    .selectAll<SVGTextElement, unknown>(".x.axis-label")
    .data([null])
    .join("text")
    .attr("class", "x axis-label")
    .attr("x", w / 2)
    .attr("y", h - 2 * margin.bottom)
    .attr("text-anchor", "middle")
    .text(label);
};

/**
 * Draws the y-axis label rotated -90° at the left middle of the chart.
 * @param selection - The D3 selection to append the label to.
 * @param label - The label text.
 * @param height - The height of the chart.
 * @param margin - The margin object of the chart.
 */
export const drawYAxisLabel = (
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  label: string,
  margin: { left: number; right: number; top: number; bottom: number }
): void => {
  const height = selection.node()?.getBoundingClientRect().height || 0;
  const h = typeof height === "string" ? parseFloat(height) : height;
  selection
    .selectAll<SVGTextElement, unknown>(".y.axis-label")
    .data([null])
    .join("text")
    .attr("class", "y axis-label")
    .attr("x", -h / 2)
    .attr("y", margin.left)
    .attr("dy", "1em")
    .attr("transform", `rotate(-90, 0, ${margin.top})`)
    .text(label)
    .attr("text-anchor", "middle");
};

/**
 * Draws the chart title at the top center of the chart.
 * @param selection - The D3 selection to append the title to.
 * @param title - The title text.
 * @param width - The width of the chart.
 * @param margin - The margin object of the chart.
 */
export const drawChartTitle = (
  selection: Selection<SVGSVGElement, unknown, null, undefined>,
  title: string,
  margin: { left: number; right: number; top: number; bottom: number }
): void => {
  const width = selection.node()?.getBoundingClientRect().width || 0;
  selection
    .selectAll<SVGTextElement, unknown>(".chart-title")
    .data([null])
    .join("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 8)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text(title);
};

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

  legendGroup
    .selectAll<SVGGElement, SeriesOptions>("g")
    .data(series)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (_, i) => `translate(0,${i * itemHeight})`)
    .call((group) => {
      group
        .selectAll<SVGRectElement, SeriesOptions>("rect")
        .data((d) => [d])
        .join("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", ({ color }) => color ?? "steelblue");

      group
        .selectAll<SVGTextElement, SeriesOptions>("text")
        .data((d) => [d])
        .join("text")
        .attr("x", 22)
        .attr("y", 12)
        .text(({ name, key }) => name ?? key)
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");
    });
};
