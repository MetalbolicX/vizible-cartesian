import { line, curveBasis, pointer, type Selection, select } from "d3";
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
      label,
    }));
    const linePath = line<{ x: number | Date; y: number }>()
      .x(({ x }) => this._xScale(x))
      .y(({ y }) => this._yScale(y));

    this._options.isCurved && linePath.curve(curveBasis);

    const transitionTime: number =
      !this._options.isChartStatic && this._options.transitionTime
        ? this._options.transitionTime
        : 0;

    this._svgSelection
      .selectAll<SVGGElement, unknown>(".series")
      .data([null])
      .join("g")
      .attr("class", "series")
      .selectAll<SVGPathElement, unknown>(`.series-${label}`)
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", `series-${label} serie`)
            .attr("data-label", label)
            .attr("d", linePath)
            .attr("fill", "none")
            .attr("stroke", lineColor)
            .call((path) => {
              // Animate the path drawing from start to end
              const node = path.node();
              if (!node) return;
              const totalLength = node.getTotalLength();
              path
                .attr("stroke-dasharray", totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(transitionTime)
                .attr("stroke-dashoffset", 0);
            }),
        (update) =>
          update
            .transition()
            .duration(transitionTime)
            .attr("stroke", lineColor)
            .attr("d", linePath),
        (exit) => exit.remove()
      );
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
    const closestDatum = this._dataset.reduce((closest, d) => {
      const datumX = this._xScale(xField(d) as number | Date);
      const closestX = this._xScale(xField(closest) as number | Date);
      return Math.abs(datumX - mouseX) < Math.abs(closestX - mouseX)
        ? d
        : closest;
    }, this._dataset[0]);

    const cursorGroup = this._svgSelection
      .selectAll(".cursor")
      .data([null])
      .join("g")
      .attr("class", "cursor");

    cursorGroup
      .selectAll<SVGLineElement, Record<string, unknown>>("line.cursor")
      .data([closestDatum])
      .join("line")
      .attr("class", "cursor")
      .attr("x1", (d) => this._xScale(xField(d) as number | Date))
      .attr("y1", yMinRange)
      .attr("x2", (d) => this._xScale(xField(d) as number | Date))
      .attr("y2", yMaxRange);

    cursorGroup
      .selectAll<SVGCircleElement, Record<string, SeriesOptions>>(
        "circle.cursor"
      )
      .data(this._ySeries)
      .join("circle")
      .attr("class", "cursor")
      .attr("cx", this._xScale(xField(closestDatum)))
      .attr("cy", ({ field }) => this._yScale(field(closestDatum)))
      .attr("r", 4)
      .attr("fill", ({ color }) => color || "steelblue");

    cursorGroup
      .selectAll<SVGTextElement, Record<string, SeriesOptions>>("text.cursor")
      .data(this._ySeries)
      .join("text")
      .attr("class", "cursor")
      .attr("x", this._xScale(xField(closestDatum)))
      .attr("y", ({ field }) => this._yScale(field(closestDatum)))
      .attr("dy", "-0.4em") // Adjust vertical position
      .text(({ field }) => field(closestDatum) as number);
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
    for (const { field, color, label } of this._ySeries) {
      this.#renderSerie(field, color, label);
    }
  }
}
