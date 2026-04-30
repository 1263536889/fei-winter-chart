import { BarChart } from 'echarts/charts';
import { use } from 'echarts/core';
import type {
  BarSeriesOption,
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type { BarChartOption, BarChartSeries } from '../type';
import { ChartService } from './chart.service';

use([BarChart]);

const PALETTE = ['#165DFF', '#BEDAFF', '#88E3FF', '#0CD2AC', '#8DE173', '#FADC19', '#FF7D00', '#C396ED'];

export class BarChartService<DataType extends object = object> extends ChartService<DataType> {
  constructor(container: HTMLElement, color: string | string[] = PALETTE) {
    super(container, color);
  }

  protected override mapOption(option: BarChartOption): EChartsOption {
    const { x, y, series } = option;
    return {
      ...super.mapOption(option, 'bar'),
      xAxis: this.mapAxis(x, true) as XAXisComponentOption,
      yAxis: this.mapAxis(y) as YAXisComponentOption,
      axisPointer: this.mapPointer('shadow'),
      series: this.#mapSeries(series),
    };
  }

  #mapSeries(series: BarChartSeries[] = []): BarSeriesOption[] {
    return series.map(mapBarSeries);
  }
}

export function mapBarSeries({ key: { x, y }, ...series }: BarChartSeries, index: number): BarSeriesOption {
  return {
    itemStyle: { borderRadius: [2, 2, 0, 0] },
    barMaxWidth: 6,
    barGap: 1 / 6,
    ...series,
    type: 'bar',
    id: `bar-${index}#${y}`,
    encode: { x, y },
  };
}
