import React from 'react';
import Chart from '../chart';
import { RangeChartService } from '../services/range-chart.service';
import type { ChartRef, ChartProps, RangeChartOption } from '../type';

export type RangeChartRef<DataType extends object = object> = ChartRef<DataType, RangeChartService<DataType>>;
export interface RangeChartProps<DataType extends object = object>
  extends Omit<ChartProps<DataType, RangeChartService<DataType>>, 'service'> {
  option: RangeChartOption;
}

const RangeChartRender: React.ForwardRefRenderFunction<RangeChartRef, RangeChartProps> = (props, ref) => {
  const { ...chart } = props;
  const service = React.useRef<RangeChartService>();

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={RangeChartService} {...chart} />;
};
const RangeChartComponent = React.forwardRef<RangeChartRef, RangeChartProps>(RangeChartRender);
type Component = <T extends object>(
  props: RangeChartProps<T> & React.RefAttributes<RangeChartRef<T>>
) => React.ReactElement;
export const RangeChart = React.memo(RangeChartComponent) as Component;
