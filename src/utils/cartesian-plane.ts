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

  /**
   * Renders the y-axis on the chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param numberFormat - Optional D3 format string (e.g., ".2f").
   */
  public renderYAxis(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    numberFormat?: string
  ): void {
    const { margin, tickSize, tickPadding } = this.options;
    const axis = axisLeft(this.yScale)
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
    const [xMin, xMax] = this.xScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".y.grid")
      .data(this.yScale.ticks())
      .join("line")
      .attr("class", "y.grid")
      .attr("x1", this.xScale(xMin))
      .attr("x2", this.xScale(xMax))
      .attr("y1", (d) => this.yScale(d))
      .attr("y2", (d) => this.yScale(d));
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
    const [yMin, yMax] = this.yScale.domain();
    selection
      .selectAll<SVGGElement, unknown>(".x.grid")
      .data(this.xScale.ticks() as NumberValue[])
      .join("line")
      .attr("class", "x.grid")
      .attr("x1", (d) => this.xScale(d))
      .attr("x2", (d) => this.xScale(d))
      .attr("y1", this.yScale(yMin))
      .attr("y2", this.yScale(yMax));
  }

  public abstract renderSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void;

  /**
   * Renders the legend on the chart.
   * @param selection - The D3 selection to append the legend to.
   * @param [x=20] - The x position of the legend.
   * @param [y=20] - The y position of the legend.
   * @example
   * ```ts
   * chart.renderLegend(d3.select("svg"), 20, 20);
   * ```
   */
  public renderLegend(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    x: number = 20,
    y: number = 20
  ): void {
    renderLegend(selection, this.ySeries, x, y);
  }

  protected get yScale() {
    return this.#yScale;
  }

  protected get options() {
    return this.#options;
  }

  protected get xScale() {
    return this.#xScale;
  }

  protected get dataset() {
    return [...this.#dataset];
  }

  protected get xSerie() {
    return this.#xSerie;
  }

  protected get ySeries() {
    return [...this.#ySeries];
  }

  protected get innerWidth() {
    return (
      this.options.width - this.options.margin.left - this.options.margin.right
    );
  }

  protected get innerHeight() {
    return (
      this.options.height - this.options.margin.top - this.options.margin.bottom
    );
  }
}
