import { timeFormat, axisBottom, type Selection, type NumberValue } from "d3";
import { LineChart } from "./line-series.ts";
import type { LineChartOptions, SeriesOptions, CartesianPlaneConfig } from "../../types.ts";

/**
 * A class for creating a time series chart using D3.js.
 * @description
 * It encapsulates the logic for drawing lines, axes, and scales.
 */
export class TimeChart extends LineChart {
  /**
   * Creates an instance of TimeChart.
   * @param config - Configuration object containing all necessary parameters for chart initialization.
   * @param config.svgSelection - The D3 selection of the SVG element where the chart will be rendered.
   * @param config.dataset - The data array for the chart. Must be a non-empty array of objects.
   * @param config.seriesConfig - Series configuration object.
   * @param config.seriesConfig.xSerie - Configuration for the x-axis series including field accessor and label.
   * @param config.seriesConfig.ySeries - Array of y-axis series configurations, each with field accessor, label, and optional color.
   * @param config.options - Optional chart configuration options including margins, styling, and behavior settings.
   * @example
   * ```ts
   * const svg = d3.select("svg");
   * const chart = new TimeChart({
   *   svgSelection: svg,
   *   dataset: data,
   *   seriesConfig: {
   *     xSerie: { field: d => d.date, label: "Date" },
   *     ySeries: [
   *       { field: d => d.sales, color: "#1f77b4", label: "Sales" },
   *       { field: d => d.cost, color: "#ff7f0e", label: "Cost" }
   *     ]
   *   }
   * });
   * // Use chart.drawLine, chart.drawLines, chart.drawXAxis, and chart.drawYAxis to render the chart.
   * ```
   */
  constructor(config: CartesianPlaneConfig<LineChartOptions>) {
    super(config);
    this._svgSelection.attr("class", "time-chart");
  }

  /**
   * Renders the x-axis on the chart.
   * @param selection - The D3 selection to append the x-axis to.
   * @param dateFormat - Optional D3 time format string (e.g., "%Y-%m-%d").
   * @example
   * ```ts
   * chart.renderXAxis(d3.select("svg"), "%b %d, %Y");
   * ```
   */
  public override renderXAxis(
    formatCode?: string
  ): void {
    const { margin, tickSize, tickPadding } = this._options;
    const { height: h } = this._size;
    const axis = axisBottom(this._xScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (formatCode?.length) {
      axis.tickFormat((domainValue: Date | NumberValue, _index: number) => {
        if (domainValue instanceof Date) {
          return timeFormat(formatCode)(domainValue);
        }
        return domainValue.toString();
      });
    }

    this._svgSelection
      .selectAll<SVGGElement, unknown>(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(axis);
  }
}
