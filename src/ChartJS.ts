import { AView } from 'tdp_core/src/views/AView';
import { getTDPData, getTDPDesc } from 'tdp_core/src/rest';
import { resolve } from 'phovea_core/src/idtype';
import { Chart } from 'chart.js';

interface IDummyData {
  id: string;
  b_cat1: string;
  b_cat2: string;
  b_name: string;
  _id: number;
  b_int: number;
  b_real: number;
}

interface IGroupedData {
  label: string;
  data: number[];
  backgroundColor: string;
}

export default class ChartJS extends AView {

  private readonly className = 'chartjs-test';
  private readonly colors = ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6'];
  private chart: Chart;

  private rows: IDummyData[];

  protected async initImpl() {
    super.initImpl();
    this.node.innerHTML = `<canvas></canvas>`;
    this.node.classList.add(this.className);

    this.rows = await this.loadRows();
    this.build();
  }

  private build() {
    const ctx = (<HTMLCanvasElement>this.node.querySelector(`.${this.className} canvas`)).getContext('2d');

    const categories = this.unique(this.rows, 'b_cat1');
    const aggregatedData = this.aggregateData(this.rows, categories);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: aggregatedData
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });
  }

  get itemIDType() {
    return resolve('IDTypeB');
  }

  protected loadRows(): Promise<IDummyData[]> {
    return getTDPData<IDummyData>('dummy', 'b');
  }

  private renderChart(rawData: IDummyData[]) {
    // TODO: Aggregate data and render chart
  }

  private unique(data: IDummyData[], key: string) {
    const set = new Set<string>();
    data.map((row) => set.add(row[key]));
    return Array.from(set).sort();
  }

  private aggregateData(data: IDummyData[], categories: string[]): IGroupedData[] {
    const subCategories = this.unique(data, 'b_cat2');

    // group by first category
    const firstSplit: {
      category: string,
      data: IDummyData[]
    }[] = categories.map((category) => {
      return {
        category,
        data: data.filter((row) => row.b_cat1 === category)
      };
    });

    // split resulting firstSplit data further to group the elements which have the first AND the second category in common
    const secondSplit: {
      subCategory: string,
      data: IDummyData[][]
    }[] = subCategories.map((subCategory) => {
      const data = firstSplit.map((split) => {
        return split.data.filter((row) => row.b_cat2 === subCategory);
      });

      return {
        subCategory,
        data
      };
    });

    const groupedData: IGroupedData[] = [];
    secondSplit.forEach((nestedSubCategory, i) => {
      const item: IGroupedData = {
        label: nestedSubCategory.subCategory,
        data: [],
        backgroundColor: this.colors[i]
      };

      nestedSubCategory.data.forEach((subCategory) => {
        item.data.push(subCategory.length);
      });
      groupedData.push(item);
    });

    return groupedData;
  }
}