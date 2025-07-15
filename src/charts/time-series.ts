import * as d3 from "d3";

interface timeSeriesChartOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  lineWidth: number;
  isCurved: boolean;
  tickSize: number;
  tickPadding: number;
}

/**
 * A class for creating a time series chart using D3.js.
 * @description
 * It encapsulates the logic for drawing lines, axes, and scales.
 */
export class TimeSeriesChart {
  #xScale: d3.ScaleTime<number, number, never>;
  #yScale: d3.ScaleLinear<number, number>;
  #options: timeSeriesChartOptions;

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
    options: Partial<timeSeriesChartOptions> = {}
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
    this.#options = {
      width,
      height,
      margin,
      lineWidth,
      isCurved,
      tickSize,
      tickPadding,
    };
    const { width: w, height: h, margin: m } = this.#options;
    this.#xScale = d3
      .scaleTime()
      .domain(xDomain)
      .range([m.left, w - m.right])
      .nice();
    this.#yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([h - m.bottom, m.top])
      .nice();
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
   */
  public drawXAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const { height, margin, tickSize, tickPadding } = this.options;
    selection
      .selectAll<SVGGElement, unknown>(".x.axis")
      .data([null])
      .join("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(this.xScale).tickSize(tickSize).tickPadding(tickPadding)
      );
  }

  /**
   * Draws the y-axis on the chart.
   * @param selection - The D3 selection to append the y-axis to.
   */
  public drawYAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const { margin, tickSize, tickPadding } = this.options;
    selection
      // .selectAll(".y.axis")
      .selectAll<SVGGElement, unknown>(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3.axisLeft(this.yScale).tickSize(tickSize).tickPadding(tickPadding)
      );
  }

  public get xScale() {
    return this.#xScale;
  }

  public get yScale() {
    return this.#yScale;
  }

  public get options() {
    return this.#options;
  }
}
