import * as d3 from "d3";
import { LineAxes, type lineChartOptions } from "./line-axes.ts";

/**
 * A class for creating a line chart with numerical x-axis using D3.js.
 */
export class LineChart extends LineAxes {
  /**
   * Creates an instance of LineChart.
   * @param xDomain - The domain for the x-axis, typically a range of numbers.
   * @param yDomain - The domain for the y-axis, typically a range of numbers.
   * @param options - Configuration options for the chart.
   * @example
   * ```ts
   * const chart = new LineChart(
   *   [0, 100],
   *   [0, 50],
   *   {
   *     width: 800,
   *     height: 600,
   *     margin: { top: 30, right: 30, bottom: 30, left: 30 },
   *     lineWidth: 1.5,
   *     isCurved: false,
   *     tickSize: 5,
   *     tickPadding: 10,
   *   }
   * );
   * // Use chart.drawLine, chart.drawXAxis, and chart.drawYAxis to render the chart.
   * ```
   */
  constructor(
    xDomain: [number, number],
    yDomain: [number, number],
    options: Partial<lineChartOptions> = {}
  ) {
    const {
      width = 800,
      height = 600,
      margin = { top: 30, right: 30, bottom: 30, left: 30 },
      lineWidth = 1.5,
      isCurved = false,
      tickSize = 5,
      tickPadding = 10,
    } = options;
    super(xDomain, yDomain, {
      width,
      height,
      margin,
      lineWidth,
      isCurved,
      tickSize,
      tickPadding,
    });
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
    const line = d3
      .line()
      .x((d) => this.xScale(xValue(d)))
      .y((d) => this.yScale(yValue(d)));

    this.options.isCurved && line.curve(d3.curveBasis);

    selection
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", this.options.lineWidth)
      .attr("d", line);
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
    selection: d3.Selection<SVGGElement, unknown, null, undefined>,
    formatCode?: string
  ): void {
    const { height, margin, tickSize, tickPadding } = this.options;
    const axis = d3
      .axisBottom(this.xScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (formatCode) {
      axis.tickFormat(d3.format(formatCode));
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
