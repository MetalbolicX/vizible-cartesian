import { timeFormat, line, curveBasis, axisBottom } from "../../utils.ts";
import { LineAxes, type lineChartOptions } from "./line-axes.ts";

/**
 * A class for creating a time series chart using D3.js.
 * @description
 * It encapsulates the logic for drawing lines, axes, and scales.
 */
export class TimeChart extends LineAxes {
  /**
   * Creates an instance of TimeSeriesChart.
   * @param xDomain - The domain for the x-axis, typically a range of dates.
   * @param yDomain - The domain for the y-axis, typically a range of numbers.
   * @param options - Configuration options for the chart.
   * @example
   * ```ts
   * const chart = new TimeSeriesChart(
   *   [new Date('2020-01-01'), new Date('2020-12-31')],
   *   [0, 100],
   *   {
   *     width: 800,
   *     height: 600,
   *     margin: { top: 30, right: 30, bottom: 30, left: 30 },
   *     xValue: (d) => d.date,
   *     yValue: (d) => d.value,
   *     lineWidth: 1.5,
   *     isCurved: false,
   *     tickSize: 5,
   *     tickPadding: 10,
   *   }
   *  );
   *  // Use chart.drawLine, chart.drawXAxis, and chart.drawYAxis to render the chart.
   * ```
   */
  constructor(
    xDomain: [Date, Date],
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
   * @param xValue - A function to extract the x value from the data.
   * @param yValue - A function to extract the y value from the data.
   * @param [lineColor=steelblue] - The color of the line.
   * @example
   * ```ts
   * const data = [
   *    { date: new Date('2020-01-01'), value: 10 },
   *    { date: new Date('2020-02-01'), value: 20 },
   *    { date: new Date('2020-03-01'), value: 30 },
   *  ];
   *
   * chart.drawLine(
   *   d3.select('svg'),
   *   data,
   *   (d) => d.date,
   *   (d) => d.value
   * );
   * ```
   */
  public drawLine(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: any[],
    xValue: (d: any) => Date,
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
