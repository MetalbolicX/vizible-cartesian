import { line, curveBasis, axisBottom, format, type Selection } from "d3";
import { LineAxes } from "./line-axes.ts";
import type { LineChartOptions, SeriesOptions } from "../../types.ts";
import { drawLegend } from "../../helpers.ts";

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
   * chart.drawLine(d3.select("svg"), "sales", "#1f77b4");
   * ```
   */
  #drawLine(
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
  public drawLines(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    for (const { key, color } of this.ySeries) {
      this.#drawLine(selection, key, color);
    }
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
   * Draws the y-axis on the chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param [x=20] - The x position of the legend.
   * @param [y=20] - The y position of the legend.
   * @example
   * ```ts
   * chart.drawYAxis(d3.select("svg"), 20, 20);
   * ```
   */
  public drawLegend(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    x: number = 20,
    y: number = 20
  ): void {
    drawLegend(selection, this.ySeries, x, y);
  }
}
