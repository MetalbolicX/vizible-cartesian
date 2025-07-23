import { line, curveBasis, axisBottom, format } from "../../utils.ts";
import { LineAxes, type lineChartOptions } from "./line-axes.ts";

/**
 * A class for creating a line chart with numerical or date x-axis using D3.js.
 */
export class LineChart extends LineAxes {
  /**
   * Creates an instance of LineChart.
   * @param dataset - The data array for the chart.
   * @param seriesConfig - Object with xSerie and ySeries arrays.
   * @param options - Configuration options for the chart.
   * @example
   * ```ts
   * const chart = new LineChart(data, {
   *   xSerie: { key: "x" },
   *   ySeries: [
   *     { key: "y1", color: "#1f77b4" },
   *     { key: "y2", color: "#ff7f0e" }
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

  /**
   * Draws a line on the chart.
   * @param selection - The D3 selection to append the line to.
   * @param data - The data to be plotted.
   * @param xValue - A function to extract the x value from the data (number).
   * @param yValue - A function to extract the y value from the data (number).
   * @param [lineColor=steelblue] - The color of the line.
   * @example
   * ```ts
   * const data = [
   *    { x: 0, y: 10 },
   *    { x: 10, y: 20 },
   *    { x: 20, y: 30 },
   *  ];
   * chart.drawLine(
   *   d3.select('svg'),
   *   data,
   *   (d) => d.x,
   *   (d) => d.y
   * );
   * ```
   */
  public drawLine(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: any[],
    xValue: (d: any) => number,
    yValue: (d: any) => number,
    lineColor: string = "steelblue"
  ): void {
    const lineGenerator = line()
      .x((d) => this.xScale(xValue(d)))
      .y((d) => this.yScale(yValue(d)));

    this.options.isCurved && lineGenerator.curve(curveBasis);

    selection
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", this.options.lineWidth)
      .attr("d", lineGenerator);
  }

  /**
   * Draws the x-axis on the chart.
   * @param selection - The D3 selection to append the x-axis to.
   * @param formatCode - Optional D3 format string (e.g., ".2f").
   * @example
   * ```ts
   * chart.drawXAxis(d3.select("svg"), ".2f");
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

    if (formatCode) {
      axis.tickFormat(format(formatCode));
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
