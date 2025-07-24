import { CartesianPlane } from "../../utils/cartesian-plane";
import type { LineChartOptions, SeriesOptions } from "../../types.ts";
import { type Selection } from "d3";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class ScatterChart extends CartesianPlane {
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
      color: pointColor
    }));
    selection.selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<SVGCircleElement, { x: number; y: number; color: string }>(`.scatter-point.${yKey}`)
      .data(data)
      .join("circle")
      .attr("class", `scatter-point ${yKey}`)
      .attr("cx", ({ x }) => this.xScale(x as number))
      .attr("cy", ({ y }) => this.yScale(y as number))
      .attr("r", radii)
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
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    radii: number = 4
  ): void {
    for (const { key, color } of this.ySeries) {
      this._drawSerie(selection, key, color, radii);
    }
  }

  public drawXAxis(selection: Selection<SVGSVGElement, unknown, null, undefined>, formatCode?: string): void {
    console.log(selection, formatCode);
  }
}
