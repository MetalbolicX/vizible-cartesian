import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type { ChartOptions, ScatterChartOptions, SeriesOptions } from "../../types.ts";
import { type Selection } from "d3";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class ScatterChart extends CartesianPlane {
  #ySeries: ScatterChartOptions[];

  /**
   * Constructs a ScatterChart instance.
   * @param dataset - The data to be visualized in the scatter chart.
   * @param seriesConfig - Configuration for the x and y series.
   * @param options - Optional chart configuration options.
   * @example
   * ```ts
   * const chart = new ScatterChart(data, {
   *   xSerie: { key: "date", type: "date" },
   *   ySeries: [
   *     { key: "sales", color: "#1f77b4", radii: 5 },
   *     { key: "profit", color: "#ff7f0e", radii: 10 },
   *   ],
   * });
   */
  constructor(
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
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
   */
  #drawSerie(
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
   * @param selection - The D3 selection to draw the series on.
   * @example
   * ```ts
   * chart.drawSeries(d3.select("svg"));
   * ```
   */
  public drawSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    for (const { key, color, radii } of this.ySeries) {
      this.#drawSerie(selection, key, color, radii);
    }
  }

  public override get ySeries() {
    return [...this.#ySeries];
  }
}
