import { timeFormat, line, curveBasis, axisBottom } from "../../utils.ts";
import { type lineChartOptions } from "./line-axes.ts";
import { LineChart } from "./line-series.ts";

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
   *   xSerie: { key: "date" },
   *   ySeries: [
   *     { key: "sales", color: "#1f77b4" },
   *     { key: "cost", color: "#ff7f0e" }
   *   ]
   * });
   * // Use chart.drawLine, chart.drawLines, chart.drawXAxis, and chart.drawYAxis to render the chart.
   * ```
   */
  constructor(
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: { key: string; };
      ySeries: { key: string; name?: string; color?: string }[];
    },
    options: Partial<lineChartOptions> = {}
  ) {
    super(dataset, seriesConfig, options);
  }

  // /**
  //  * Draws a single line for a given y series key (multi-series support).
  //  * @param selection - The D3 selection to append the line to.
  //  * @param yKey - The key of the y series to draw.
  //  * @param lineColor - The color of the line.
  //  */
  // #drawLine(
  //   selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  //   yKey: string,
  //   lineColor?: string
  // ): void {
  //   const xKey = this.xSerie.key;
  //   const data = this.dataset;
  //   const lineGenerator = line<Record<string, unknown>>()
  //     .x((d) => this.xScale(d[xKey] as Date | number))
  //     .y((d) => this.yScale(d[yKey] as number));

  //   this.options.isCurved && lineGenerator.curve(curveBasis);

  //   selection.selectAll<SVGPathElement, unknown>(`path.series-${yKey}`)
  //     .data([data])
  //     .join("path")
  //     .attr("class", `series series-${yKey}`)
  //     .attr("fill", "none")
  //     .attr("stroke", lineColor ?? "steelblue")
  //     .attr("stroke-width", this.options.lineWidth)
  //     .attr("d", lineGenerator);
  // }

  // /**
  //  * Draws all y series as lines on the chart.
  //  * @param selection - The D3 selection to append the lines to.
  //  */
  // public drawLines(
  //   selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
  // ): void {
  //   for (const serie of this.ySeries) {
  //     this.#drawLine(selection, serie.key, serie.color);
  //   }
  // }

  /**
   * Draws the x-axis on the chart.
   * @param selection - The D3 selection to append the x-axis to.
   * @param dateFormat - Optional D3 time format string (e.g., "%Y-%m-%d").
   * @example
   * ```ts
   * chart.drawXAxis(d3.select("svg"), "%b %d, %Y");
   * ```
   */
  public drawXAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    formatCode?: string
  ): void {
    const { height, margin, tickSize, tickPadding } = this.options;
    const axis = axisBottom(this.xScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (formatCode?.length) {
      axis.tickFormat((domainValue: Date | d3.NumberValue, _index: number) => {
        if (domainValue instanceof Date) {
          return timeFormat(formatCode)(domainValue);
        }
        return domainValue.toString();
      });
    }

    selection
      .selectAll<SVGGElement, unknown>(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(axis);
  }
}
