import { line, curveBasis, type Selection } from "d3";
import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type { LineChartOptions, SeriesOptions } from "../../types.ts";


/**
 * A class for creating a line chart with numerical or date x-axis using D3.js.
 */
export class LineChart extends CartesianPlane {
  /**
   * Creates an instance of LineChart.
   * @param svgSelection - The D3 selection of the SVG element.
   * @param dataset - The data array for the chart.
   * @param seriesConfig - Object with xSerie and ySeries arrays.
   * @param options - Configuration options for the chart.
   * @example
   * ```ts
   * const svg = d3.select("svg");
   * const chart = new LineChart(svg, data, {
   *   xSerie: { field: d => d.x, label: "X Axis" },
   *   ySeries: [
   *     { field: d => d.y1, color: "#1f77b4", label: "Y1 Axis" },
   *     { field: d => d.y2, color: "#ff7f0e", label: "Y2 Axis" }
   *   ]
   * });
   * ```
   */
  constructor(
    svgSelection: Selection<SVGSVGElement, unknown, null, undefined>,
    dataset: Record<string, unknown>[],
    seriesConfig: {
      xSerie: SeriesOptions;
      ySeries: SeriesOptions[];
    },
    options: Partial<LineChartOptions> = {}
  ) {
    super(svgSelection, dataset, seriesConfig, options);
  }

  /**
   * Draws a single line for a given y series key.
   * @param yKey - The key of the y series to draw.
   * @param [lineColor="steelblue"] - The color of the line.
   */
  #renderSerie(
    yField: (data: Record<string, unknown>) => Date | number,
    lineColor: string = "steelblue",
    label: string = ""
  ): void {
    const { field: xField } = this._xSerie;
    const data = this._dataset.map((d) => ({
      x: xField(d) as number | Date,
      y: yField(d) as number,
    }));
    const linePath = line<{ x: number | Date; y: number }>()
      .x(({ x }) => this._xScale(x))
      .y(({ y }) => this._yScale(y));

    this._options.isCurved && linePath.curve(curveBasis);

    this._svgSelection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<SVGPathElement, unknown>(`.series-${label}`)
      .data([data])
      .join("path")
      .attr("class", `series-${label}`)
      .attr("d", linePath)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", this._options.lineWidth);
  }

  /**
   * Renders all y series as lines on the chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public renderSeries(): void {
    for (const { field, color, label } of this._ySeries) {
      this.#renderSerie(field, color, label);
    }
  }
}
