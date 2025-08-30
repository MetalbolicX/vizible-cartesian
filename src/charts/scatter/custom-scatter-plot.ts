import { ScatterChart } from "./scatter-plot.ts";
import type {
  ChartOptions,
  CustomerScatterChartOptions,
  SeriesOptions,
  CustomScatterChartConfig,
} from "../../types.ts";
import { type Selection } from "d3";

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
   * Renders a scatter plot for a given y series key.
   * @param yKey - The key of the y series to draw.
   * @param [pointColor="steelblue"] - The color of the points.
   * @param [icon=""] - The SVG path for the icon to use for each point.
   * @param [size=1] - The size scaling factor for the icon.
   */
  #renderSerie(
    yField: (data: Record<string, unknown>) => number | Date,
    pointColor: string = "steelblue",
    icon: string = "",
    size: number = 1,
    label: string = ""
  ): void {
    const { field: xField } = this._xSerie;
    const data = this._dataset.map((d) => ({
      x: xField(d) as number,
      y: yField(d),
      color: pointColor,
      radius:
        typeof d["radii"] === "number" && !isNaN(d["radii"]) ? d["radii"] : 4,
      icon: d["icon"] ?? icon,
      label,
    }));

    const transitionTime =
      !this._options.isChartStatic && this._options.transitionTime
        ? this._options.transitionTime
        : 0;

    this._svgSelection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<
        SVGPathElement,
        {
          x: number;
          y: number;
          color: string;
          radius: number;
          icon: string;
          label: string;
        }
      >(`.scatter-point[data-label="${label}"]`)
      .data(data)
      .join(
        (enter) =>
          enter
            .append("path")
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
            .transition()
            .duration(transitionTime)
            .attr(
              "transform",
              ({ x, y }) =>
                `translate(${this._xScale(x as number)},${this._yScale(
                  y
                )}) scale(${size})`
            ),
        (update) =>
          update
            .transition()
            .duration(transitionTime)
            .attr(
              "transform",
              ({ x, y }) =>
                `translate(${this._xScale(x as number)},${this._yScale(
                  y
                )}) scale(${size})`
            ),
        (exit) => exit.remove()
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
  public override renderSeries(): void {
    for (const { field, color, icon, size, label } of this._ySeries) {
      const validatedSize = typeof size === "number" && size > 0 ? size : 1;
      this.#renderSerie(
        field,
        color ?? "steelblue",
        icon ?? "",
        validatedSize,
        label
      );
    }
  }

  protected override get _ySeries() {
    return [...this.#ySeries];
  }
}
