import * as d3 from "d3";

export interface lineChartOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  lineWidth: number;
  isCurved: boolean;
  tickSize: number;
  tickPadding: number;
}

export abstract class LineAxes {
  #xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>;
  #yScale: d3.ScaleLinear<number, number>;
  #options: lineChartOptions;

  /**
   * Creates an instance of LineAxes.
   * @param xDomain - The domain for the x-axis, typically a range of numbers or dates.
   * @param yDomain - The domain for the y-axis, typically a range of numbers.
   * @param options - Configuration options for the chart.
   */
  constructor(
    xDomain: [number, number] | [Date, Date],
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
    const [xMin, xMax] = xDomain;
    const { margin: m, width: w, height: h } = this.#options;
    if (xMin instanceof Date && xMax instanceof Date) {
      this.#xScale = d3
        .scaleTime()
        .domain([xMin, xMax])
        .range([m.left, w - m.right])
        .nice();
    } else {
      this.#xScale = d3
        .scaleLinear()
        .domain(xDomain as [number, number])
        .range([m.left, w - m.right])
        .nice();
    }
    this.#yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([h - m.bottom, m.top])
      .nice();
  }

  public abstract drawXAxis(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    formatCode?: string
  ): void;

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
      axis.tickFormat(
        (domainValue: number | d3.NumberValue, _index: number) => {
          if (typeof domainValue === "number") {
            return d3.format(numberFormat)(domainValue);
          }
          return domainValue.toString();
        }
      );
    }

    selection
      .selectAll<SVGGElement, unknown>(".y.axis")
      .data([null])
      .join("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axis);
  }

  /**
   * Draws the y-axis grid lines on the chart.
   * @param selection - The D3 selection to append the y-axis grid lines to.
   */
  public drawYGridLines(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const [xMin, xMax] = this.xScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".y.grid")
      .data(this.yScale.ticks())
      .join("line")
      .attr("class", "y.grid")
      .attr("x1", this.xScale(xMin))
      .attr("x2", this.xScale(xMax))
      .attr("y1", (d) => this.yScale(d))
      .attr("y2", (d) => this.yScale(d))
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "2,2");
  }

  /**
   * Draws the x-axis grid lines on the chart.
   * @param selection - The D3 selection to append the x-axis grid lines to.
   */
  public drawXGridLines(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const [yMin, yMax] = this.yScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".x.grid")
      .data(this.xScale.ticks() as d3.NumberValue[])
      .join("line")
      .attr("class", "x.grid")
      .attr("x1", (d) => this.xScale(d))
      .attr("x2", (d) => this.xScale(d))
      .attr("y1", this.yScale(yMin))
      .attr("y2", this.yScale(yMax))
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "2,2");
  }

  public get yScale() {
    return this.#yScale;
  }

  public get options() {
    return this.#options;
  }

  public get xScale() {
    return this.#xScale;
  }
}
