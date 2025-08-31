import { ScatterChart } from "./scatter-plot.ts";
import type {
  ChartOptions,
  CustomerScatterChartOptions,
  CustomScatterChartConfig,
} from "../../types.ts";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class CustomScatterChart extends ScatterChart {
  #ySeries: CustomerScatterChartOptions[];

  /**
   * Constructs a CustomScatterChart instance.
   * @param config - Configuration object containing all necessary parameters for chart initialization.
   * @param config.svgSelection - The D3 selection of the SVG element where the chart will be rendered.
   * @param config.dataset - The data array for the chart. Must be a non-empty array of objects.
   * @param config.seriesConfig - Series configuration object for custom scatter charts.
   * @param config.seriesConfig.xSerie - Configuration for the x-axis series including field accessor and label.
   * @param config.seriesConfig.ySeries - Array of custom scatter chart y-axis series configurations with field accessor, label, color, icon, and size.
   * @param config.options - Optional chart configuration options including margins, styling, and behavior settings.
   * @example
   * ```ts
   * const svg = d3.select("svg");
   * const chart = new CustomScatterChart({
   *   svgSelection: svg,
   *   dataset: data,
   *   seriesConfig: {
   *     xSerie: { field: d => d.date, label: "Date" },
   *     ySeries: [
   *       { field: d => d.sales, color: "#1f77b4", label: "Sales" },
   *       { field: d => d.profit, color: "#ff7f0e", icon: "M10 10 H 90 V 90 H 10 L 10 10", size: 0.5, label: "Profit" },
   *     ]
   *   }
   * });
   * ```
   */
  constructor(config: CustomScatterChartConfig<ChartOptions>) {
    const { svgSelection, dataset, seriesConfig, options } = config;
    super({
      svgSelection,
      dataset,
      seriesConfig: {
        xSerie: seriesConfig.xSerie,
        ySeries: seriesConfig.ySeries,
      },
      options,
    });
    this.#ySeries = [...seriesConfig.ySeries];
    this._svgSelection.attr("class", "custom-scatter-chart");
  }

  /**
   * Renders the series on the chart.
   * Renders all series in the scatter chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public override renderSeries(): void {
    const seriesGroup = this._svgSelection
      .selectAll(".series")
      .data([null])
      .join("g")
      .attr("class", "series");

    seriesGroup
      .selectAll(".series-group")
      .data(this._ySeries)
      .join("g")
      .attr("class", "series-group")
      .attr("data-label", ({ label }) => label)
      .selectAll<SVGPathElement, unknown>(".scatter-point")
      .data(({ field, color, icon, size, label }) => {
        const { field: xField } = this._xSerie;
        return this._dataset.map((d) => ({
          x: xField(d) as number,
          y: field(d) as number,
          color: color ?? "steelblue",
          radius: typeof d["radii"] === "number" && !isNaN(d["radii"]) ? d["radii"] : 4,
          size: typeof size === "number" && size > 0 ? size : 1,
          icon: icon ?? "",
          label,
        }));
      })
      .join("path")
      .attr("class", "scatter-point")
      .attr("data-label", ({ label }) => label)
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
        ({ x, y, size }) =>
          `translate(${this._xScale(x as number)},${this._yScale(y)}) scale(${size})`
      );
  }

  protected override get _ySeries() {
    return [...this.#ySeries];
  }
}
