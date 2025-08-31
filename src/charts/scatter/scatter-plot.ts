import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type {
  ChartOptions,
  ScatterChartOptions,
  ScatterChartConfig,
} from "../../types.ts";

/**
 * A class for creating a scatter chart with numerical or date x-axis using D3.js.
 */
export class ScatterChart extends CartesianPlane {
  #ySeries: ScatterChartOptions[];

  /**
   * Constructs a ScatterChart instance.
   * @param config - Configuration object containing all necessary parameters for chart initialization.
   * @param config.svgSelection - The D3 selection of the SVG element where the chart will be rendered.
   * @param config.dataset - The data array for the chart. Must be a non-empty array of objects.
   * @param config.seriesConfig - Series configuration object for scatter charts.
   * @param config.seriesConfig.xSerie - Configuration for the x-axis series including field accessor and label.
   * @param config.seriesConfig.ySeries - Array of scatter chart y-axis series configurations with field accessor, label, color, and radii.
   * @param config.options - Optional chart configuration options including margins, styling, and behavior settings.
   * @example
   * ```ts
   * const svg = d3.select("svg");
   * const chart = new ScatterChart({
   *   svgSelection: svg,
   *   dataset: data,
   *   seriesConfig: {
   *     xSerie: { field: d => d.date, label: "Date" },
   *     ySeries: [
   *       { field: d => d.sales, color: "#1f77b4", radii: 5, label: "Sales" },
   *       { field: d => d.profit, color: "#ff7f0e", radii: 10, label: "Profit" },
   *     ]
   *   }
   * });
   * ```
   */
  constructor(config: ScatterChartConfig<ChartOptions>) {
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
    this._svgSelection.attr("class", "scatter-chart");
  }

  /**
   * Renders all series in the scatter chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public renderSeries(): void {
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
      .selectAll<
        SVGCircleElement,
        { x: number; y: number; color: string; radius: number; label: string }
      >(".scatter-point")
      .data(({ field, color, radii, label }) => {
        const { field: xField } = this._xSerie;
        return this._dataset.map((d) => ({
          x: xField(d) as number,
          y: field(d) as number,
          color: color ?? "steelblue",
          radius: radii ?? 4,
          label,
        }));
      })
      .join("circle")
      .attr("class", "scatter-point")
      .attr("data-label", ({ label }) => label)
      .attr("fill", ({ color }) => color)
      .attr("r", ({ radius }) => radius)
      .attr("cx", ({ x }) => this._xScale(x))
      .attr("cy", ({ y }) => this._yScale(y));
  }

  protected override get _ySeries() {
    return [...this.#ySeries];
  }
}
