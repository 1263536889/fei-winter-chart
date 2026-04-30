import React from 'react';
import Chart from '../chart';
import { BarChartService } from '../services/bar-chart.service';
import type { ChartRef, ChartProps, BarChartOption } from '../type';

export type BarChartRef<DataType extends object = object> = ChartRef<DataType, BarChartService<DataType>>;
export interface BarChartProps<DataType extends object = object>
  extends Omit<ChartProps<DataType, BarChartService<DataType>>, 'service'> {
  option: BarChartOption;
}

const BarChartRender: React.ForwardRefRenderFunction<BarChartRef, BarChartProps> = (props, ref) => {
  const { ...chart } = props;
  const service = React.useRef<BarChartService>();

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={BarChartService} {...chart} />;
};
const BarChartComponent = React.forwardRef<BarChartRef, BarChartProps>(BarChartRender);
type Component = <T extends object>(
  props: BarChartProps<T> & React.RefAttributes<BarChartRef<T>>
) => React.ReactElement;
export const BarChart = React.memo(BarChartComponent) as Component;
