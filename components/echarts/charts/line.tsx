import React from 'react';
import Chart from '../chart';
import { LineChartService } from '../services/line-chart.service';
import type { ChartRef, ChartProps, LineChartOption } from '../type';

export type LineChartRef<DataType extends object = object> = ChartRef<DataType, LineChartService<DataType>>;
export interface LineChartProps<DataType extends object = object>
  extends Omit<ChartProps<DataType, LineChartService<DataType>>, 'service'> {
  option: LineChartOption;
}

const LineChartRender: React.ForwardRefRenderFunction<LineChartRef, LineChartProps> = (props, ref) => {
  const { ...chart } = props;
  const service = React.useRef<LineChartService>();

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={LineChartService} {...chart} />;
};
const LineChartComponent = React.forwardRef<LineChartRef, LineChartProps>(LineChartRender);
type Component = <T extends object>(
  props: LineChartProps<T> & React.RefAttributes<LineChartRef<T>>
) => React.ReactElement;
export const LineChart = React.memo(LineChartComponent) as Component;
