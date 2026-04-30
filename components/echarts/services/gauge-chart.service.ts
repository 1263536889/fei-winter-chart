import { GaugeChart } from 'echarts/charts';
import { use } from 'echarts/core';
import type { EChartsOption, GaugeSeriesOption } from 'echarts/types/dist/echarts';
import type { GaugeChartData, GaugeChartOption, GaugeChartSeries } from '../type';
import { ChartService } from './chart.service';

use([GaugeChart]);

const COLOR = '#165DFF';

export class GaugeChartService extends ChartService<GaugeChartData> {
  constructor(container: HTMLElement, color: string | string[] = COLOR) {
    super(container, color);
  }

  renderData({ name, value, total }: GaugeChartData): void {
    this._chart.setOption({
      series: {
        type: 'gauge',
        max: total,
        data: [{ name, value }],
        detail: { formatter: `${((value / total) * 100).toFixed()}{u|%}` },
      },
    });
  }

  protected override mapOption(option: GaugeChartOption): EChartsOption {
    const { series } = option;
    return { ...super.mapOption(option, 'gauge'), legend: { show: false }, series: this.#mapSeries(series) };
  }

  protected override handleResize(rect: DOMRectReadOnly): void {
    super.handleResize(rect);
    const r = Math.min(this._chart.getWidth(), this._chart.getHeight()) / 2;
    this._chart.setOption({
      series: { type: 'gauge', radius: r, axisLine: { lineStyle: { width: r * 0.12 } }, progress: { width: r * 0.12 } },
    });
  }

  #mapSeries({ ...rest }: GaugeChartSeries = {}): GaugeSeriesOption {
    return {
      startAngle: 90,
      endAngle: -270,
      axisLine: { show: true, lineStyle: { color: [[1, `${this._palette[0]}29`]] } },
      progress: { show: true, roundCap: true },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      title: { offsetCenter: [0, -16], color: '#86909C', fontWeight: 400, fontSize: 14, lineHeight: 20 },
      detail: {
        color: '#1D2129',
        fontWeight: 500,
        fontSize: 20,
        lineHeight: 20,
        textShadowColor: 'currentColor',
        textShadowBlur: 0.25,
        rich: { u: { color: '#1D2129', fontWeight: 500, fontSize: 16, verticalAlign: 'bottom' } },
        offsetCenter: [0, 12],
      },
      ...rest,
      type: 'gauge',
      id: 'gauge-0#value',
    };
  }
}
