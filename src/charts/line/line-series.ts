import { line, curveBasis, type Selection } from "d3";
import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type { LineChartOptions, SeriesOptions } from "../../types.ts";

/**
 * A class for creating a line chart with numerical or date x-axis using D3.js.
 */
export class LineChart extends CartesianPlane {
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
      xSerie: { key: string };
      ySeries: SeriesOptions[];
    },
    options: Partial<LineChartOptions> = {}
  ) {
    super(dataset, seriesConfig, options);
  }

  /**
   * Draws a single line for a given y series key.
   * @param selection - The D3 selection to append the line to.
   * @param yKey - The key of the y series to draw.
   * @param [lineColor="steelblue"] - The color of the line.
   * @example
   * ```ts
   * chart.drawSerie(d3.select("svg"), "sales", "#1f77b4");
   * ```
   */
  #drawSerie(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    yKey: string,
    lineColor: string = "steelblue"
  ): void {
    const { key: xKey } = this.xSerie;
    const data = this.dataset.map((d) => ({
      x: d[xKey],
      y: Number(d[yKey]),
    }));
    const linePath = line<Record<string, unknown>>()
      .x(({ x }) => this.xScale(x as number | Date))
      .y(({ y }) => this.yScale(y as number));

    this.options.isCurved && linePath.curve(curveBasis);

    selection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<SVGPathElement, unknown>(`.series-${yKey}`)
      .data([data])
      .join("path")
      .attr("class", `series-${yKey}`)
      .attr("d", linePath)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", this.options.lineWidth);
  }

  /**
   * Draws all y series as lines on the chart.
   * @param selection - The D3 selection to append the lines to.
   * @example
   * ```ts
   * chart.drawLines(d3.select("svg"));
   * ```
   */
  public drawSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    for (const { key, color } of this.ySeries) {
      this.#drawSerie(selection, key, color);
    }
  }
}
