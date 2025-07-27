import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type {
  ChartOptions,
  CustomerScatterChartOptions,
  SeriesOptions,
} from "../../types.ts";
import { type Selection } from "d3";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class CustomScatterChart extends CartesianPlane {
  #ySeries: CustomerScatterChartOptions[];

  /**
   * Constructs a CustomScatterChart instance.
   * @param dataset - The data to be visualized in the scatter chart.
   * @param seriesConfig - Configuration for the x and y series.
   * @param options - Optional chart configuration options.
   * @example
   * ```ts
   * const chart = new CustomScatterChart(data, {
   *   xSerie: { key: "date", type: "date" },
   *   ySeries: [
   *     { key: "sales", color: "#1f77b4" },
   *     { key: "profit", color: "#ff7f0e", icon: "M10 10 H 90 V 90 H 10 L 10 10", size: 0.5 },
   *   ],
   * });
   * ```
   */
  constructor(
    svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: CustomerScatterChartOptions[];
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
   * @param [icon=""] - The SVG path for the icon to use for each point.
   * @param [size=1] - The size scaling factor for the icon.
   */
  #renderSerie(
    yKey: string,
    pointColor: string = "steelblue",
    icon: string = "",
    size: number = 1
  ): void {
    const { key: xKey } = this._xSerie;
    const data = this._dataset.map((d) => ({
      x: d[xKey],
      y: d[yKey],
      color: pointColor,
      radius:
        typeof d["radii"] === "number" && !isNaN(d["radii"]) ? d["radii"] : 4,
      icon: d["icon"] ?? icon,
    }));
    this._svgSelection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<
        SVGPathElement,
        { x: number; y: number; color: string; radius: number; icon: string }
      >(`.scatter-icon.${yKey}`)
      .data(data)
      .join("path")
      .attr("class", `scatter-icon ${yKey}`)
      .attr("d", ({ icon, radius }) => {
        if (typeof icon === "string" && icon.length > 0) {
          return icon;
        }
        // Draw a circle path as fallback
        return `M 0 0 m -${radius}, 0 a ${radius},${radius} 0 1,0 ${
          2 * radius
        },0 a ${radius},${radius} 0 1,0 -${2 * radius},0`;
      })
      .attr("fill", ({ color }) => color)
      .attr(
        "transform",
        ({ x, y }) =>
          `translate(${this._xScale(x as number)},${this._yScale(
            y as number
          )}) scale(${size})`
      );
  }

  /**
   * Renders the series on the chart.
   * Renders all series in the scatter chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public renderSeries(): void {
    for (const { key, color, icon, size } of this._ySeries) {
      const validatedSize = typeof size === "number" && size > 0 ? size : 1;
      this.#renderSerie(key, color ?? "steelblue", icon ?? "", validatedSize);
    }
  }

  protected override get _ySeries() {
    return [...this.#ySeries];
  }
}
