import type {
  BarSeriesOption,
  EChartsOption,
  LegendComponentOption,
  LineSeriesOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type { ChartLegend, ChartType, LineChartSeries, MixChartOption, MixChartSeries } from '../type';
import { mapBarSeries } from './bar-chart.service';
import { ChartService } from './chart.service';
import { mapLineSeries } from './line-chart.service';

export class MixChartService<DataType extends object = object> extends ChartService<DataType> {
  protected override mapOption(option: MixChartOption): EChartsOption {
    const { legend, x, y, series } = option;
    return {
      ...super.mapOption(option),
      legend: this.mapLegend(legend, undefined, series),
      xAxis: this.mapAxis(x, true) as XAXisComponentOption,
      yAxis: this.mapAxis(y) as YAXisComponentOption,
      axisPointer: this.mapPointer('shadow'),
      series: this.#mapSeries(series),
    };
  }

  protected override mapLegend(
    legend?: ChartLegend,
    type?: ChartType,
    series: MixChartSeries[] = []
  ): LegendComponentOption {
    return {
      ...super.mapLegend(legend, type),
      itemWidth: 10,
      data: series.map(({ type, name }) => ({ name: name?.toString(), icon: this.mapIcon(type) })),
    };
  }

  #mapSeries(series: MixChartSeries[] = []): (LineSeriesOption | BarSeriesOption)[] {
    return series.map(({ type, ...rest }, index) =>
      type === 'line'
        ? mapLineSeries(rest as LineChartSeries, index, this._palette[index % this._palette.length])
        : mapBarSeries(rest, index)
    );
  }
}
