import { PieChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';
import { use } from 'echarts/core';
import type {
  EChartsOption,
  LegendComponentOption,
  PieSeriesOption,
  TitleComponentOption,
} from 'echarts/types/dist/echarts';
import type { ChartLegend, PieChartOption, PieChartSeries, PieChartTitle } from '../type';
import { ChartService } from './chart.service';

use([PieChart, TitleComponent]);

const PALETTE = ['#165DFF', '#FADC19', '#0CD2AC', '#8DE173', '#FF7D00', '#C396ED', '#BEDAFF', '#88E3FF'];

export class PieChartService<DataType extends object = object> extends ChartService<DataType> {
  #data: { [key: string]: number } = {};
  #total?: number;
  #formatter = (total?: number) => total?.toFixed() ?? '-';

  set data(data: { [key: string]: number }) {
    this.#data = data ?? {};
    this.#total = 0;
    Object.values(this.#data).forEach((v) => (this.#total! += v));
    this._chart.setOption({ title: { subtext: this.#formatter(this.#total) } });
  }

  constructor(container: HTMLElement, color: string | string[] = PALETTE) {
    super(container, color);
  }

  protected override mapOption(option: PieChartOption): EChartsOption {
    const { totalFormatter, title, series } = option;
    totalFormatter && (this.#formatter = totalFormatter);
    return { ...super.mapOption(option, 'pie'), title: this.#mapTitle(title), series: this.#mapSeries(series) };
  }

  protected override mapLegend(legend?: ChartLegend): LegendComponentOption {
    return {
      ...super.mapLegend(legend, 'pie'),
      orient: 'vertical',
      top: 'center',
      right: 0,
      padding: 0,
      itemGap: 20,
      formatter: (name) => `{l|${name}} {v|${this.#total ? ((this.#data[name] / this.#total) * 100).toFixed() : '-'}%}`,
      textStyle: {
        padding: [0, 0, -3, 0],
        rich: {
          l: { color: '#86909C', fontWeight: 400, fontSize: 12, lineHeight: 17, align: 'left' },
          v: { color: '#1D2129', fontWeight: 400, fontSize: 12, lineHeight: 17, align: 'right', width: 50 },
        },
      },
      ...legend,
    };
  }

  protected override handleResize(rect: DOMRectReadOnly): void {
    super.handleResize(rect);
    const r = Math.min(this._chart.getWidth(), this._chart.getHeight()) / 2;
    this._chart.setOption({
      title: { left: r, top: 'middle' },
      series: {
        type: 'pie',
        center: [r, '50%'],
        radius: [(r / 1.048) * 0.88, r / 1.048],
        emphasis: { scaleSize: (r / 1.048) * 0.12 * 0.4 },
      },
    });
  }

  #mapTitle(title: PieChartTitle = {}): TitleComponentOption {
    return {
      textStyle: { color: '#86909C', fontWeight: 400, fontSize: 14, lineHeight: 20 },
      subtext: this.#formatter(this.#total),
      subtextStyle: {
        color: '#1D2129',
        fontWeight: 500,
        fontSize: 20,
        lineHeight: 28,
        textShadowColor: 'currentColor',
        textShadowBlur: 0.25,
      },
      textAlign: 'center',
      textVerticalAlign: 'top',
      padding: 0,
      itemGap: 6,
      ...title,
    };
  }

  #mapSeries({ key: { name, value }, ...series }: PieChartSeries): PieSeriesOption {
    return {
      label: { show: false },
      itemStyle: { borderColor: '#FFFFFF', borderWidth: 1 },
      ...series,
      type: 'pie',
      id: `pie-0#${value}`,
      encode: { itemName: name, value },
    };
  }
}
