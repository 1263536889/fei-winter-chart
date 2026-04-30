import { LineChart } from 'echarts/charts';
import { use } from 'echarts/core';
import type {
  EChartsOption,
  LineSeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type { LineChartOption, LineChartSeries } from '../type';
import { ChartService } from './chart.service';

use([LineChart]);

const PALETTE: string[] = ['#165DFF', '#88E3FF', '#0CD2AC', '#8DE173', '#FADC19', '#FF7D00', '#C396ED'];

export class LineChartService<DataType extends object = object> extends ChartService<DataType> {
  constructor(container: HTMLElement, color: string | string[] = PALETTE) {
    super(container, color);
  }

  protected override mapOption(option: LineChartOption): EChartsOption {
    const { x, y, series } = option;
    return {
      ...super.mapOption(option, 'line'),
      xAxis: this.mapAxis(x, true) as XAXisComponentOption,
      yAxis: this.mapAxis(y) as YAXisComponentOption,
      axisPointer: this.mapPointer('line'),
      series: this.#mapSeries(series),
    };
  }

  #mapSeries(series: LineChartSeries[] = []): LineSeriesOption[] {
    return series.map((config, index) => mapLineSeries(config, index, this._palette[index % this._palette.length]));
  }
}

export function mapLineSeries(
  { key: { x, y }, ...series }: LineChartSeries,
  index: number,
  color: string
): LineSeriesOption {
  return {
    symbol: 'emptyCircle',
    symbolSize: 16,
    showSymbol: false,
    itemStyle: { borderColor: '#FFFFFF', borderWidth: 1 },
    lineStyle: { color, width: 1, shadowColor: `${color}B8`, shadowBlur: 6, shadowOffsetY: 4 },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: `${color}14` },
          { offset: 1, color: `${color}00` },
        ],
      },
      opacity: 1,
    },
    emphasis: { scale: 1, lineStyle: { width: 2 } },
    smooth: true,
    ...series,
    type: 'line',
    id: `line-${index}#${y}`,
    encode: { x, y },
  };
}
