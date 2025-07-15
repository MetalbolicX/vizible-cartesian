import * as d3 from "d3";

interface lineChartOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  lineWidth: number;
  isCurved: boolean;
  tickSize: number;
  tickPadding: number;
}

/**
 * A class for creating a line chart with numerical x-axis using D3.js.
 * @description
 * Encapsulates logic for drawing lines, axes, and scales.
 */
export class LineChart {
  #xScale: d3.ScaleLinear<number, number>;
  #yScale: d3.ScaleLinear<number, number>;
  #options: lineChartOptions;

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
      .scaleLinear()
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
   * @param numberFormat - Optional D3 format string (e.g., ".2f").
   * @example
   * ```ts
   * chart.drawXAxis(d3.select("svg"), ".1f");
   * ```
   */
  public drawXAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    numberFormat?: string
  ): void {
    const { height, margin, tickSize, tickPadding } = this.options;
    const axis = d3
      .axisBottom(this.xScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (numberFormat?.length) {
      axis.tickFormat((domainValue: number | d3.NumberValue, _index: number) => {
        if (typeof domainValue === "number") {
          return d3.format(numberFormat)(domainValue);
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

  /**
   * Draws the y-axis on the chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param numberFormat - Optional D3 format string (e.g., ".2f").
   */
  public drawYAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    numberFormat?: string
  ): void {
    const { margin, tickSize, tickPadding } = this.options;
    const axis = d3
      .axisLeft(this.yScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (numberFormat?.length) {
      axis.tickFormat((domainValue: number | d3.NumberValue, _index: number) => {
        if (typeof domainValue === "number") {
          return d3.format(numberFormat)(domainValue);
        }
        return domainValue.toString();
      });
    }

    selection
      .selectAll<SVGGElement, unknown>(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axis);
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
