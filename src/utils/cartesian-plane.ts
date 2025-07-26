import {
  scaleLinear,
  scaleTime,
  axisLeft,
  axisBottom,
  format,
  type Selection,
  type ScaleLinear,
  type ScaleTime,
  type NumberValue,
} from "d3";
import type { SeriesOptions, LineChartOptions } from "../types.ts";
import { renderLegend } from "./helpers.ts";

/**
 * Gets the x-axis domain from the dataset.
 * @param dataset - The data array for the chart.
 * @param xKey - The key for the x-axis data.
 * @returns A tuple representing the min and max values for the x-axis.
 * @example
 * ```ts
 * const [min, max] = getXDomain(data, "date");
 * ```
 */
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

/**
 * Gets the y-axis domain from the dataset.
 * @param dataset - The data array for the chart.
 * @param series - Array of series options containing keys for y-axis data.
 * @returns A tuple representing the min and max values for the y-axis.
 * @example
 * ```ts
 * const [min, max] = getYDomain(data, [{ key: "sales" }, { key: "cost" }]);
 * ```
 */
const getYDomain = (dataset, series) => {
  const values = dataset.flatMap((d) =>
    series.map((s) => Number(d[s.key])).filter((v) => !isNaN(v))
  );
  return [Math.min(...values), Math.max(...values)];
};

// export type LineAxesSeriesConfig = {
//   xSerie: SeriesOptions;
//   ySeries: SeriesOptions[];
// };

export abstract class CartesianPlane {
  #xScale: ScaleLinear<number, number> | ScaleTime<number, number>;
  #yScale: ScaleLinear<number, number>;
  #options: LineChartOptions;
  #dataset: Record<string, unknown>[];
  #xSerie: SeriesOptions;
  #ySeries: SeriesOptions[];

  /**
   * Creates an instance of CartesianPlane.
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
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: SeriesOptions[];
    },
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
    const { key: xKey } = this.#xSerie;
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

  /**
   * Renders the x-axis on the chart.
   * @param selection - The D3 selection to append the x-axis to.
   * @param formatCode - Optional D3 format string (e.g., ".2f").
   * @example
   * ```ts
   * chart.renderXAxis(d3.select("svg"), ".2f");
   * ```
   */
  public renderXAxis(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    formatCode?: string
  ): void {
    const { height, margin, tickSize, tickPadding } = this._options;
    const axis = axisBottom(this._xScale)
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

  /**
   * Renders the y-axis on the chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param numberFormat - Optional D3 format string (e.g., ".2f").
   */
  public renderYAxis(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    numberFormat?: string
  ): void {
    const { margin, tickSize, tickPadding } = this._options;
    const axis = axisLeft(this._yScale)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (numberFormat?.length) {
      axis.tickFormat((domainValue: number | NumberValue, _index: number) => {
        if (typeof domainValue === "number") {
          return format(numberFormat)(domainValue);
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

  /**
   * Renders the y-axis grid lines on the chart.
   * @param selection - The D3 selection to append the y-axis grid lines to.
   * @example
   * ```ts
   * chart.renderYGridLines(d3.select("svg"));
   * ```
   */
  public renderYGridLines(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const [xMin, xMax] = this._xScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".y.grid")
      .data(this._yScale.ticks())
      .join("line")
      .attr("class", "y.grid")
      .attr("x1", this._xScale(xMin))
      .attr("x2", this._xScale(xMax))
      .attr("y1", (d) => this._yScale(d))
      .attr("y2", (d) => this._yScale(d));
  }

  /**
   * Renders the x-axis grid lines on the chart.
   * @param selection - The D3 selection to append the x-axis grid lines to.
   * @example
   * ```ts
   * chart.renderXGridLines(d3.select("svg"));
   * ```
   */
  public renderXGridLines(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    const [yMin, yMax] = this._yScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".x.grid")
      .data(this._xScale.ticks() as NumberValue[])
      .join("line")
      .attr("class", "x.grid")
      .attr("x1", (d) => this._xScale(d))
      .attr("x2", (d) => this._xScale(d))
      .attr("y1", this._yScale(yMin))
      .attr("y2", this._yScale(yMax));
  }

  public abstract renderSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void;

  /**
   * Renders the legend for the chart.
   * @param selection - The D3 selection to append the legend to.
   * @param [legendItemHeight=20] - The height of each legend item.
   * @param [x=innerWidth] - The x position of the legend. By default, it is positioned at the right edge of the chart.
   * @param [y=margin.top] - The y position of the legend. By default, it is positioned at the top edge of the chart.
   * @example
   * ```ts
   * chart.renderLegend(d3.select("svg"), 20, 20, 20);
   * ```
   */
  public renderLegend(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    legendItemHeight: number = 20,
    { x = this._innerWidth, y = this._options.margin.top } = {}
  ): void {
    const legendGroup = selection
      .selectAll<SVGGElement, unknown>(".legend")
      .data([null])
      .join("g")
      .attr("class", "legend")
      .attr("transform", `translate(${x},${y})`);

    legendGroup
      .selectAll<SVGGElement, SeriesOptions>("g")
      .data(this._ySeries)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(0,${i * legendItemHeight})`)
      .call((group) => {
        group
          .selectAll<SVGRectElement, SeriesOptions>("rect")
          .data((d) => [d])
          .join("rect")
          .attr("width", 16)
          .attr("height", 16)
          .attr("fill", ({ color }) => color ?? "steelblue");

        group
          .selectAll<SVGTextElement, SeriesOptions>("text")
          .data((d) => [d])
          .join("text")
          .attr("x", 22)
          .attr("y", 12)
          .text(({ name, key }) => name ?? key)
          .attr("alignment-baseline", "middle");
      });
  }

  /**
   * Renders the chart title.
   * @param selection - The D3 selection to append the title to.
   * @param title - The title text to display.
   * @example
   * ```ts
   * chart.renderChartTitle(d3.select("svg"), "Sales and Cost Over Time");
   * ```
   */
  public renderChartTitle(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    title: string
  ): void {
    const { margin } = this._options;
    selection
      .selectAll<SVGTextElement, unknown>(".chart-title")
      .data([null])
      .join("text")
      .attr("class", "chart-title")
      .attr("x", this._innerWidth / 2 + margin.left)
      .attr("y", margin.top / 2)
      .attr("dy", "0.5em")
      .text(title);
  }

  /**
   * Renders the y-axis label for the chart.
   * @param selection - The D3 selection to append the y-axis label to.
   * @param label - The label text to display.
   * @link [Source to position y label](https://datatricks.co.uk/animated-d3-js-scatter-plot-in-r)
   * @example
   * ```ts
   * chart.renderYAxisLabel(d3.select("svg"), "Sales");
   * ```
   */
  public renderYAxisLabel(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    label: string,
  ): void {
    const { margin } = this._options;
    selection
      .selectAll<SVGTextElement, unknown>(".y.axis-label")
      .data([null])
      .join("text")
      .attr("class", "y axis-label")
      .attr("x", -margin.top)
      .attr("y", margin.left)
      .attr("transform", `rotate(-90, ${margin.left}, ${margin.top})`)
      .attr("dy", "1.2em")
      .text(label);
  }

  /**
   * Renders the x-axis label for the chart.
   * @param selection - The D3 selection to append the x-axis label to.
   * @param label - The label text to display.
   * @example
   * ```ts
   * chart.renderXAxisLabel(d3.select("svg"), "Date");
   * ```
   */
  public renderXAxisLabel(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    label: string,
  ): void {
    const { margin } = this._options;
    selection
      .selectAll<SVGTextElement, unknown>(".x.axis-label")
      .data([null])
      .join("text")
      .attr("class", "x axis-label")
      .attr("x", this._innerWidth / 2 + margin.left)
      .attr("y", this._innerHeight + margin.top)
      .attr("dy", "-0.5em")
      .text(label);
  }

  protected get _yScale() {
    return this.#yScale;
  }

  protected get _options() {
    return this.#options;
  }

  protected get _xScale() {
    return this.#xScale;
  }

  protected get _dataset() {
    return [...this.#dataset];
  }

  protected get _xSerie() {
    return this.#xSerie;
  }

  protected get _ySeries() {
    return [...this.#ySeries];
  }

  protected get _innerWidth() {
    return (
      this._options.width -
      this._options.margin.left -
      this._options.margin.right
    );
  }

  protected get _innerHeight() {
    return (
      this._options.height -
      this._options.margin.top -
      this._options.margin.bottom
    );
  }
}
