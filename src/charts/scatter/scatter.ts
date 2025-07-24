import { CartesianPlane } from "../../utils/cartesian-plane";
import type { ChartOptions, ScatterChartOptions } from "../../types.ts";
import { type Selection, axisBottom, format } from "d3";
import { drawLegend } from "../../utils/helpers.ts";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class ScatterChart extends CartesianPlane {
  #ySeries: ScatterChartOptions[];

  constructor(
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: { key: string };
      ySeries: ScatterChartOptions[];
    },
    options: Partial<ChartOptions> = {}
  ) {
    super(dataset, seriesConfig, options);
    this.#ySeries = [...seriesConfig.ySeries];
  }

  /**
   * Draws a scatter plot for a given y series key.
   * @param selection - The D3 selection to append the scatter points to.
   * @param yKey - The key of the y series to draw.
   * @param [pointColor="steelblue"] - The color of the points.
   * @param [radii=4] - The radius of the points.
   * @example
   * ```ts
   * chart.drawScatter(d3.select("svg"), "sales", "#1f77b4");
   * ```
   */
  protected _drawSerie(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    yKey: string,
    pointColor: string = "steelblue",
    radii: number = 4
  ): void {
    const { key: xKey } = this.xSerie;
    const data = this.dataset.map((d) => ({
      x: d[xKey],
      y: d[yKey],
      color: pointColor,
      radius:
        typeof d["radii"] === "number" && !isNaN(d["radii"])
          ? d["radii"]
          : radii,
    }));
    selection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<
        SVGCircleElement,
        { x: number; y: number; color: string; radius: number }
      >(`.scatter-point.${yKey}`)
      .data(data)
      .join("circle")
      .attr("class", `scatter-point ${yKey}`)
      .attr("cx", ({ x }) => this.xScale(x as number))
      .attr("cy", ({ y }) => this.yScale(y as number))
      .attr("r", ({ radius }) => radius)
      .attr("fill", ({ color }) => color);
  }

  /**
   * Draws all series in the scatter chart.
   * @param selection - The D3 selection to append the scatter points to.
   * @param [radii=4] - The radius of the points.
   * @example
   * ```ts
   * chart.drawSeries(d3.select("svg"), 4);
   * ```
   */
  public drawSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    for (const { key, color, radii } of this.ySeries) {
      this._drawSerie(selection, key, color, radii);
    }
  }

  /**
   * Draws the y-axis for the scatter chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param [formatCode] - Optional format code for the y-axis labels.
   * @example
   * ```ts
   * chart.drawYAxis(d3.select("svg"), ".2f");
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
   * Draws the y-axis for the scatter chart.
   * @param selection - The D3 selection to append the y-axis to.
   * @param [formatCode] - Optional format code for the y-axis labels.
   * @example
   * ```ts
   * chart.drawYAxis(d3.select("svg"), ".2f");
   * ```
   */
  public drawLegend(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    x: number = 20,
    y: number = 20
  ): void {
    drawLegend(selection, this.ySeries, x, y);
  }

  public get ySeries() {
    return this.#ySeries;
  }
}
