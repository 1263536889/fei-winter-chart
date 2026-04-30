import { CustomChart } from 'echarts/charts';
import { use } from 'echarts/core';
import type {
  CustomSeriesOption,
  EChartsOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type { ChartAxis, ChartTooltip, ChartType, RangeChartOption, RangeChartSeries } from '../type';
import { ChartService } from './chart.service';

use([CustomChart]);

export class RangeChartService<DataType extends object = object> extends ChartService<DataType> {
  protected override mapOption(option: RangeChartOption): EChartsOption {
    const { x, y, series } = option;
    return {
      ...super.mapOption(option),
      legend: { show: false },
      xAxis: this.mapAxis(x) as XAXisComponentOption,
      yAxis: this.mapAxis(y, true) as YAXisComponentOption,
      series: this.#mapSeries(series),
    };
  }

  protected override mapAxis(axis: ChartAxis = {}, primary?: boolean): XAXisComponentOption | YAXisComponentOption {
    return {
      ...super.mapAxis(axis, !primary),
      type: primary ? 'category' : 'value',
      splitLine: { show: false },
      splitArea: {
        interval: 0,
        show: primary,
        areaStyle: {
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0.25, color: '#F7F8FA00' },
                { offset: 0.25, color: '#F7F8FA' },
                { offset: 0.75, color: '#F7F8FA' },
                { offset: 0.75, color: '#F7F8FA00' },
              ],
            },
          ],
        },
      },
      axisPointer: { show: false },
      ...axis,
    };
  }

  protected override mapTooltip(tooltip: ChartTooltip = {}): TooltipComponentOption {
    const { labelFormatter, valueFormatter } = tooltip;
    return {
      ...super.mapTooltip(tooltip, true),
      formatter: (series) => {
        if (series instanceof Array) return '';
        const { seriesType, seriesId, name, data, color } = series;
        let [, start = '', end = ''] = seriesId?.split('#') ?? [];
        start = (data as Record<string, string>)[start];
        end = (data as Record<string, string>)[end];
        return `
        <div style="display: flex; align-items: center; padding: 10px 16px">
          <svg style="width: 10; height: 6" viewBox="0 0 1706 1024" fill="${color}">
            <path d="${this.mapIcon(seriesType as ChartType).slice(7)}" />
          </svg>
          <label style="margin-inline: 4px 24px; font-size: 12px; font-weight:400; line-height:17px; color: #86909C">
            ${labelFormatter ? labelFormatter(name) : name}
          </label>
          <span style="font-size: 12px; font-weight:500; line-height:17px; color: #1D2129; text-shadow: 0 0 0.25px currentcolor">
            ${(valueFormatter ? valueFormatter([start, end]) : +end - +start) ?? '-'}
          </span>
        </div>
      `;
      },
    };
  }

  #mapSeries({ key: { y, name, start, end }, ...rest }: RangeChartSeries): CustomSeriesOption {
    return {
      colorBy: 'data',
      ...rest,
      type: 'custom',
      id: `range-0#${start}#${end}`,
      renderItem: (params, api) => {
        const index = api.value(y);
        const [x1, y1] = api.coord([api.value(start), index]);
        const [x2] = api.coord([api.value(end), index]);
        const [, height] = api.size!(y) as [number, number];
        const color = api.visual('color');
        return {
          type: 'rect',
          shape: { x: x1, y: y1 - height / 4, width: x2 - x1, height: height / 2, r: 2 },
          style: { fill: color },
          transition: 'shape',
        };
      },
      encode: { itemName: name, x: [start, end], y },
    };
  }
}
