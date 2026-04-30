import React from 'react';
import Chart from '../chart';
import { GaugeChartService } from '../services/gauge-chart.service';
import type { ChartRef, ChartProps, GaugeChartOption, GaugeChartData } from '../type';

export type GaugeChartRef = ChartRef<GaugeChartData, GaugeChartService>;
export interface GaugeChartProps extends Omit<ChartProps, 'service' | 'source' | 'color'> {
  source: GaugeChartData;
  option?: GaugeChartOption;
  color?: string;
}

const GaugeChartRender: React.ForwardRefRenderFunction<GaugeChartRef, GaugeChartProps> = (props, ref) => {
  const { source, ...chart } = props;
  const service = React.useRef<GaugeChartService>();

  React.useEffect(() => service.current?.renderData(source), [source]);

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={GaugeChartService} {...chart} />;
};
const GaugeChartComponent = React.forwardRef<GaugeChartRef, GaugeChartProps>(GaugeChartRender);
export const GaugeChart = React.memo(GaugeChartComponent);
