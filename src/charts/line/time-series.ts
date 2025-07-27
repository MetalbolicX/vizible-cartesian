import { timeFormat, axisBottom, type Selection, type NumberValue } from "d3";
import { LineChart } from "./line-series.ts";
import type { LineChartOptions, SeriesOptions } from "../../types.ts";

/**
 * A class for creating a time series chart using D3.js.
 * @description
 * It encapsulates the logic for drawing lines, axes, and scales.
 */
export class TimeChart extends LineChart {
  /**
   * Creates an instance of TimeChart.
   * @param dataset - The data array for the chart.
   * @param seriesConfig - Object with xSerie and ySeries arrays.
   * @param options - Configuration options for the chart.
   * @example
   * ```ts
   * const chart = new TimeChart(data, {
   *   xSerie: { field: "date" },
   *   ySeries: [
   *     { field: "sales", color: "#1f77b4" },
   *     { field: "cost", color: "#ff7f0e" }
   *   ]
   * });
   * // Use chart.drawLine, chart.drawLines, chart.drawXAxis, and chart.drawYAxis to render the chart.
   * ```
   */
  constructor(
    svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: SeriesOptions[];
    },
    options: Partial<LineChartOptions> = {}
  ) {
    super(svgSelection, dataset, seriesConfig, options);
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
