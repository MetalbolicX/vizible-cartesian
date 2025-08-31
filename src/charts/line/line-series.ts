import { line, curveBasis, pointer } from "d3";
import { CartesianPlane } from "../../utils/cartesian-plane.ts";
import type {
  LineChartOptions,
  CartesianPlaneConfig,
} from "../../types.ts";

/**
 * A class for creating a line chart with numerical or date x-axis using D3.js.
 */
export class LineChart extends CartesianPlane {
  /**
   * Creates an instance of LineChart.
   * @param config - Configuration object containing all necessary parameters for chart initialization.
   * @param config.svgSelection - The D3 selection of the SVG element where the chart will be rendered.
   * @param config.dataset - The data array for the chart. Must be a non-empty array of objects.
   * @param config.seriesConfig - Series configuration object.
   * @param config.seriesConfig.xSerie - Configuration for the x-axis series including field accessor and label.
   * @param config.seriesConfig.ySeries - Array of y-axis series configurations, each with field accessor, label, and optional color.
   * @param config.options - Optional chart configuration options including margins, styling, and behavior settings.
   * @example
   * ```ts
   * const svg = d3.select("svg");
   * const chart = new LineChart({
   *   svgSelection: svg,
   *   dataset: data,
   *   seriesConfig: {
   *     xSerie: { field: d => d.x, label: "X Axis" },
   *     ySeries: [
   *       { field: d => d.y1, color: "#1f77b4", label: "Y1 Axis" },
   *       { field: d => d.y2, color: "#ff7f0e", label: "Y2 Axis" }
   *     ]
   *   }
   * });
   * ```
   */
  constructor(config: CartesianPlaneConfig<LineChartOptions>) {
    super(config);
    this._svgSelection.attr("class", "line-chart");
  }

  #renderCursor(closestDatum: Record<string, unknown>): void {
    const seriesGroup = this._svgSelection
      .selectAll(".series")
      .data([null])
      .join("g")
      .attr("class", "series");

    seriesGroup
      .selectAll(".series-group")
      .data(
        this._ySeries.map(({ label, field, color }) => ({
          label,
          color: color || "steelblue",
          x: this._xSerie.field(closestDatum) as number | Date,
          y: field(closestDatum) as number,
        }))
      )
      .join("g")
      .attr("class", "series-group")
      .attr("data-label", ({ label }) => label)
      .selectAll(".cursor.point")
      .data(({ x, y, color, label }) => [{ x, y, color, label }])
      .join("circle")
      .attr("class", "cursor point")
      .attr("data-label", ({ label }) => label)
      .attr("cx", ({ x }) => this._xScale(x))
      .attr("cy", ({ y }) => this._yScale(y))
      .attr("r", 4)
      .attr("stroke", ({ color }) => color);

    const [yMinRange, yMaxRange] = this._yScale.range();

    seriesGroup
      .selectAll(".cursor.vertical-line")
      .data([closestDatum])
      .join("line")
      .attr("class", "cursor vertical-line")
      .attr("x1", (d) => this._xScale(this._xSerie.field(d) as number | Date))
      .attr("y1", yMinRange)
      .attr("x2", (d) => this._xScale(this._xSerie.field(d) as number | Date))
      .attr("y2", yMaxRange);
  }

  /**
   * Handles the cursor movement and updates the cursor line and points.
   * @param event - The mouse event triggering the cursor update.
   */
  #handleCursor = (event: MouseEvent): void => {
    const [mouseX, mouseY] = pointer(event);
    const [xMinRange, xMaxRange] = this._xScale.range();
    const [yMaxRange, yMinRange] = this._yScale.range();

    // Check if the mouse coordinates are within the x and y axis area
    const isWithinXAxis = mouseX >= xMinRange && mouseX <= xMaxRange;
    const isWithinYAxis = mouseY >= yMinRange && mouseY <= yMaxRange;
    if (!(isWithinXAxis && isWithinYAxis)) {
      this._svgSelection.selectAll(".cursor").remove();
      return;
    }

    // Find the closest data point to the mouse x-coordinate
    // This assumes the xField returns a Date or number that can be scaled
    const { field: xField } = this._xSerie;
    const [firstRow] = this._dataset;

    const closestDatum = this._dataset.reduce((closest, d) => {
      const datumX = this._xScale(xField(d) as number | Date);
      const closestX = this._xScale(xField(closest) as number | Date);
      return Math.abs(datumX - mouseX) < Math.abs(closestX - mouseX)
        ? d
        : closest;
    }, firstRow);

    this.#renderCursor(closestDatum);
  };

  /**
   * Renders the cursor line and points on the chart.
   * This method adds an event listener for mouse movement to update the cursor position.
   * @example
   * ```ts
   * chart.renderCursor();
   * ```
   */
  public renderCursor(): void {
    if (this._options.isChartStatic) return;
    this._svgSelection.on("pointermove", this.#handleCursor);
  }

  /**
   * Renders all y series as lines on the chart.
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

    const lineGenerator = line<{ x: number | Date; y: number }>()
      .x(({ x }) => this._xScale(x))
      .y(({ y }) => this._yScale(y));

    this._options.isCurved && lineGenerator.curve(curveBasis);

    seriesGroup
      .selectAll(".series-group")
      .data(this._ySeries)
      .join("g")
      .attr("class", "series-group")
      .attr("data-label", ({ label }) => label)
      .selectAll<SVGPathElement, Record<string, unknown>>(".serie")
      .data(({ field, color, label }) => [
        {
          label,
          color: color ?? "steelblue",
          coordinates: this._dataset.map((d) => ({
            x: this._xSerie.field(d),
            y: field(d) as number,
          })),
        },
      ])
      .join("path")
      .attr("class", "serie")
      .attr("data-label", ({ label }) => label)
      .attr("d", ({ coordinates }) => lineGenerator(coordinates))
      .style("stroke", ({ color }) => color);
  }
}
