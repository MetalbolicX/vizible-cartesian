import { scaleLinear, scaleTime, axisLeft, format } from "../../utils.ts";
import type { SeriesOptions, LineChartOptions } from "../../types.ts";

const getXDomain = (
  dataset: Record<string, unknown>[],
  xKey: string
): [number, number] | [Date, Date] => {
  const values = dataset
    .map((d) => d[xKey])
    .filter((v) => v !== undefined && v !== null);
  if (!values.length) {
    throw new Error("No values found for xKey in dataset");
  }
  const [first] = values;
  if (first instanceof Date) {
    const timestamps = values.map((v) => (v as Date).getTime());
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    return [new Date(min), new Date(max)];
  } else if (typeof first === "number") {
    const nums = values.map((v) => Number(v));
    return [Math.min(...nums), Math.max(...nums)];
  } else {
    throw new Error("x values must be Date or number");
  }
};

const getYDomain = (dataset, series) => {
  const values = dataset.flatMap((d) =>
    series.map((s) => Number(d[s.key])).filter((v) => !isNaN(v))
  );
  return [Math.min(...values), Math.max(...values)];
};

export type LineAxesSeriesConfig = {
  xSerie: SeriesOptions;
  ySeries: SeriesOptions[];
};

export abstract class LineAxes {
  #xScale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>;
  #yScale: d3.ScaleLinear<number, number>;
  #options: LineChartOptions;
  #dataset: Record<string, unknown>[];
  #xSerie: SeriesOptions;
  #ySeries: SeriesOptions[];

  /**
   * Creates an instance of LineAxes.
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
   * ```
   */
  constructor(
    dataset: Record<string, unknown>[],
    seriesConfig: LineAxesSeriesConfig,
    options: Partial<LineChartOptions> = {}
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
    if (!(dataset?.length && Array.isArray(dataset))) {
      throw new Error("Dataset must be a non-empty array.");
    }
    if (
      !seriesConfig?.xSerie?.key ||
      !(seriesConfig?.ySeries?.length && Array.isArray(seriesConfig.ySeries))
    ) {
      throw new Error(
        "seriesConfig must have xSerie and a non-empty ySeries array."
      );
    }
    this.#dataset = [...dataset];
    this.#xSerie = { ...seriesConfig.xSerie };
    this.#ySeries = [...seriesConfig.ySeries];
    this.#options = {
      width,
      height,
      margin,
      lineWidth,
      isCurved,
      tickSize,
      tickPadding,
    };
    const xKey = this.#xSerie.key;
    const [xMin, xMax] = getXDomain(dataset, xKey);
    const { margin: m, width: w, height: h } = this.#options;
    if (xMin instanceof Date && xMax instanceof Date) {
      this.#xScale = scaleTime()
        .domain([xMin, xMax])
        .range([m.left, w - m.right])
        .nice();
    } else {
      this.#xScale = scaleLinear()
        .domain([xMin, xMax] as [number, number])
        .range([m.left, w - m.right])
        .nice();
    }
    const yDomain = getYDomain(dataset, this.#ySeries);
    this.#yScale = scaleLinear()
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
    const axis = axisLeft(this.yScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (numberFormat?.length) {
      axis.tickFormat(
        (domainValue: number | d3.NumberValue, _index: number) => {
          if (typeof domainValue === "number") {
            return format(numberFormat)(domainValue);
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

  /**
   * Draws a legend for all y series.
   * @param selection - The D3 selection to append the legend to.
   * @param [x=20] - The x position of the legend.
   * @param [y=20] - The y position of the legend.
   * @example
   * ```ts
   * chart.drawLegend(d3.select("svg"), 20, 20);
   * ```
   */
  public drawLegend(
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    x: number = 20,
    y: number = 20
  ): void {
    const legendGroup = selection
      .selectAll<SVGGElement, unknown>(".legend")
      .data([null])
      .join("g")
      .attr("class", "legend")
      .attr("transform", `translate(${x},${y})`);

    const itemHeight = 20;
    legendGroup.selectAll<SVGGElement, SeriesOptions>("g")
      .data(this.ySeries)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(0,${i * itemHeight})`)
      .selectAll("rect")
      .data((d) => [d])
      .join("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", ({ color }) => color ?? "steelblue");

    legendGroup.selectAll<SVGGElement, SeriesOptions>("g")
      .data(this.ySeries)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(0,${i * itemHeight})`)
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .attr("x", 22)
      .attr("y", 12)
      .text(({ name, key }) => name ?? key)
      .style("font-size", "14px")
      .attr("alignment-baseline", "middle");
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

  public get dataset() {
    return this.#dataset;
  }

  public get xSerie() {
    return this.#xSerie;
  }

  public get ySeries() {
    return this.#ySeries;
  }
}
