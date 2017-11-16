import { getTDPRows } from 'tdp_core/src/rest';
import { resolve } from 'phovea_core/src/idtype';
import { AView } from 'tdp_core/src/views/AView';
import * as d3 from 'd3v4';
import './style.scss';

interface IRow {
  _id: number;
  b_cat1: string;
  b_cat2: string;
  b_int: number;
  b_name: string;
  b_real: number;
  id: string;
}

interface IAggregatedData {
  key: string;
  values: IRow[];
};


export default class D3View extends AView {

  private static readonly MARGINS = {
    top: 20,
    right: 20,
    left: 40,
    bottom: 40
  };

  private static readonly SVG_WIDTH = 750;
  private static readonly SVG_HEIGHT = 500;

  private static readonly CHART_WIDTH = D3View.SVG_WIDTH - D3View.MARGINS.left - D3View.MARGINS.right;
  private static readonly CHART_HEIGHT = D3View.SVG_HEIGHT - D3View.MARGINS.top - D3View.MARGINS.bottom;

  // 10 percent space (of the bar width) between bars
  private static readonly INNER_PADDING = 0.1;

  // 5 percent space (of the bar width) left of the first and right of the last bar
  private static readonly OUTER_PADDING = 0.05;

  private rows: IRow[];

  private readonly x = d3.scaleBand()
    .rangeRound([0, D3View.CHART_WIDTH]) // output range along the x-axis
    .paddingOuter(D3View.OUTER_PADDING)
    .paddingInner(D3View.INNER_PADDING);

  private readonly y = d3.scaleLinear()
    .range([D3View.CHART_HEIGHT, 0]); // output range along the y-axis

  private readonly xAxis = d3.axisBottom(this.x);
  private readonly yAxis = d3.axisLeft(this.y);

  protected async initImpl() {
    super.initImpl();
    this.rows = await this.loadRows();
    this.node.className = 'd3view';
    this.node.innerHTML = `
       <svg width="${D3View.SVG_WIDTH}" height="${D3View.SVG_HEIGHT}">
           <g class="chart-layer" transform="translate(${D3View.MARGINS.left}, ${D3View.MARGINS.top})"></g>
           <g class="axis-layer">
               <g class="axis x-axis" transform="translate(${D3View.MARGINS.left}, ${D3View.CHART_HEIGHT + D3View.MARGINS.top})"></g>
               <g class="axis y-axis" transform="translate(${D3View.MARGINS.left}, ${D3View.MARGINS.top})"></g>
               <text transform="translate(0, ${D3View.SVG_HEIGHT / 2}) rotate(-90)" text-anchor="middle" dy="10">Amount of elements within category</text>
               <text transform="translate(${D3View.SVG_WIDTH / 2}, ${D3View.SVG_HEIGHT})" text-anchor="middle" dy="-5">Categories of b_cat1 property</text>
           </g>
       </svg>
   `;

    this.build();
  }

  /**
   * get IDType for the item rows
   * @returns {IDType}
   */
  get itemIDType() {
    return resolve('IDTypeB');
  }
  
  /**
   * get data from the rest api
   * @returns {Promise<IRow[]>}
   */
  protected loadRows(): Promise<IRow[]> {
    return getTDPRows('dummy', 'b');
  }

  /**
   * Aggregate data by grouping by key with d3.nest. A group contains an array with all entries having the same key
   * @param {IRow[]} data
   * @returns {IAggregatedData[]}
   */
  private static aggregateData(data: IRow[]): IAggregatedData[] {
    return d3.nest()
      .key((d: IRow) => d.b_cat1)
      .entries(data);
  }

  private build() {
    const aggregatedData = D3View.aggregateData(this.rows);

    const keys = aggregatedData.map((group) => group.key);

    // input domain for the x-axis
    this.x.domain(keys);

    // input domain for the y-axis
    this.y.domain([0, d3.max(aggregatedData, (group) => group.values.length)]);

    const $chartView = d3.select(this.node).select('.chart-layer');

    // UPDATE selection
    const $bars = $chartView.selectAll('rect')
      .data(aggregatedData);

    const $barsEnter = $bars
      .enter() // ENTER selection
      .append('rect')
      .attr('fill', 'steelblue');

    // merge ENTER and UPDATE selections
    const $barsEnterAndUpdate = $barsEnter
      .merge($bars);

    $barsEnterAndUpdate
      .attr('x', (group) => this.x(group.key))
      .attr('y', (group) => this.y(group.values.length))
      .attr('width', (group) => this.x.bandwidth())
      .attr('height', (group) => D3View.CHART_HEIGHT - this.y(group.values.length));

    // EXIT selection
    $bars.exit().remove();

    this.updateAxes();
  }

  private updateAxes() {
    const $xAxis = d3.select(this.node).select('.x-axis');
    const $yAxis = d3.select(this.node).select('.y-axis');

    $xAxis.call(this.xAxis);
    $yAxis.call(this.yAxis);
  }
}