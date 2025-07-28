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
   *   xSerie: { field: d => d.date, label: "Date" },
   *   ySeries: [
   *     { field: d => d.sales, color: "#1f77b4", radii: 5, label: "Sales" },
   *     { field: d => d.profit, color: "#ff7f0e", radii: 10, label: "Profit" },
   *   ],
   * });
   */
  constructor(
    svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: ScatterChartOptions[];
    },
    options: Partial<ChartOptions> = {}
  ) {
    super(svgSelection, dataset, seriesConfig, options);
    this.#ySeries = [...seriesConfig.ySeries];
  }

  /**
   * Renders a scatter plot for a given y series key.
   * @param yKey - The key of the y series to draw.
   * @param [pointColor="steelblue"] - The color of the points.
   * @param [radii=4] - The radius of the points.
   */
  #renderSerie(
    yField: (data: Record<string, unknown>) => number | Date,
    pointColor: string = "steelblue",
    radii: number = 4,
    label: string = ""
  ): void {
    const { field: xField } = this._xSerie;
    const data = this._dataset.map((d) => ({
      x: xField(d) as number | Date,
      y: yField(d) as number,
      color: pointColor,
      radius:
        typeof d["radii"] === "number" && !isNaN(d["radii"])
          ? d["radii"]
          : radii,
    }));
    this._svgSelection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<
        SVGCircleElement,
        { x: number; y: number; color: string; radius: number }
      >(`.scatter-point.${label}`)
      .data(data)
      .join("circle")
      .attr("class", `scatter-point ${label}`)
      .attr("cx", ({ x }) => this._xScale(x as number))
      .attr("cy", ({ y }) => this._yScale(y))
      .attr("r", ({ radius }) => radius)
      .attr("fill", ({ color }) => color);
  }

  /**
   * Renders all series in the scatter chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public renderSeries(): void {
    for (const { field, color, radii, label } of this._ySeries) {
      this.#renderSerie(field, color, radii, label);
    }
  }

  protected override get _ySeries() {
    return [...this.#ySeries];
  }
}
