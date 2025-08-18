import { line, curveBasis, pointer, type Selection, select, bisector } from "d3";
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
    this._svgSelection.on("mousemove", this.#handleCursor);
  }

  /**
   * Renders all y series as lines on the chart.
   * @example
   * ```ts
   * chart.renderSeries();
   * ```
   */
  public renderSeries(): void {
    // for (const { field, color, label } of this._ySeries) {
    //   this.#renderSerie(field, color, label);
    // }
    const seriesGroup = this._svgSelection
      .selectAll(".series")
      .data([null])
      .join("g")
      .attr("class", "series");

    const lineGenerator = line<{ x: number | Date; y: number }>()
      .x(({ x }) => this._xScale(x))
      .y(({ y }) => this._yScale(y));

    this._options.isCurved && lineGenerator.curve(curveBasis);

    const transitionTime: number =
      !this._options.isChartStatic && this._options.transitionTime
        ? this._options.transitionTime
        : 0;

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
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "serie")
            .attr("data-label", ({ label }) => label)
            .attr("d", ({ coordinates }) => lineGenerator(coordinates))
            .style("stroke", ({ color }) => color)
            .each(function () {
              // Animation for each individual path element
              const path = select(this);
              const totalLength = (this as SVGPathElement).getTotalLength();

              path
                .attr("stroke-dasharray", totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(transitionTime)
                .attr("stroke-dashoffset", 0);
            }),
        (update) =>
          update
            .each(function () {
              select(this)
                .attr("stroke-dasharray", null)
                .attr("stroke-dashoffset", null);
            })
            .transition()
            .duration(transitionTime)
            .style("stroke", ({ color }) => color)
            .attr("d", ({ coordinates }) => lineGenerator(coordinates)),
        (exit) => exit.remove()
      );
  }
}
