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

  constructor(
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: CustomerScatterChartOptions[];
    },
    options: Partial<ChartOptions> = {}
  ) {
    super(dataset, seriesConfig, options);
    this.#ySeries = [...seriesConfig.ySeries];
  }

  #drawSerie(
    selection: Selection<SVGSVGElement, unknown, null, undefined>,
    yKey: string,
    pointColor: string = "steelblue",
    icon: string = "",
    size: number = 1
  ): void {
    const { key: xKey } = this.xSerie;
    const data = this.dataset.map((d) => ({
      x: d[xKey],
      y: d[yKey],
      color: pointColor,
      radius:
        typeof d["radii"] === "number" && !isNaN(d["radii"]) ? d["radii"] : 4,
      icon: d["icon"] ?? icon,
    }));
    selection
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
          `translate(${this.xScale(x as number)},${this.yScale(
            y as number
          )}) scale(${size})`
      );
  }

  /**
   * Draws the series on the chart.
   * @param selection - The D3 selection to draw the series on.
   * Draws all series in the scatter chart.
   * @example
   * ```ts
   * chart.drawSeries(d3.select("svg"));
   * ```
   */
  public drawSeries(
    selection: Selection<SVGSVGElement, unknown, null, undefined>
  ): void {
    for (const { key, color, icon, size } of this.ySeries) {
      const validatedSize = typeof size === "number" && size > 0 ? size : 1;
      this.#drawSerie(selection, key, color ?? "steelblue", icon ?? "", validatedSize);
    }
  }

  public override get ySeries() {
    return [...this.#ySeries];
  }
}
