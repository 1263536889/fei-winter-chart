import React from 'react';
import Chart from '../chart';
import { MixChartService } from '../services/mix-chart.service';
import type { ChartRef, ChartProps, MixChartOption } from '../type';

export type MixChartRef<DataType extends object = object> = ChartRef<DataType, MixChartService<DataType>>;
export interface MixChartProps<DataType extends object = object>
  extends Omit<ChartProps<DataType, MixChartService<DataType>>, 'service'> {
  option: MixChartOption;
}

const MixChartRender: React.ForwardRefRenderFunction<MixChartRef, MixChartProps> = (props, ref) => {
  const { ...chart } = props;
  const service = React.useRef<MixChartService>();

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={MixChartService} {...chart} />;
};
const MixChartComponent = React.forwardRef<MixChartRef, MixChartProps>(MixChartRender);
type Component = <T extends object>(
  props: MixChartProps<T> & React.RefAttributes<MixChartRef<T>>
) => React.ReactElement;
export const MixChart = React.memo(MixChartComponent) as Component;
