import React from 'react';
import Chart from '../chart';
import { PieChartService } from '../services/pie-chart.service';
import type { ChartRef, ChartProps, PieChartOption } from '../type';

export type PieChartRef<DataType extends object = object> = ChartRef<DataType, PieChartService<DataType>>;
export interface PieChartProps<DataType extends object = object>
  extends Omit<ChartProps<DataType, PieChartService<DataType>>, 'service'> {
  option: PieChartOption;
}

const PieChartRender: React.ForwardRefRenderFunction<PieChartRef, PieChartProps> = (props, ref) => {
  const { option, source, ...chart } = props;
  const service = React.useRef<PieChartService>();

  React.useEffect(() => {
    if (!service.current) return;
    const data: { [key: string]: number } = {};
    if (source?.length) {
      const { name, value } = option.series.key;
      (source as { [key: React.Key]: string }[]).forEach((v) => (data[v[name]] = +v[value]));
    }
    service.current.data = data;
  }, [source, option.series.key]);

  //#region 实例方法
  React.useImperativeHandle(ref, () => service.current);
  //#endregion

  return <Chart ref={service} service={PieChartService} option={option} source={source} {...chart} />;
};
const PieChartComponent = React.forwardRef<PieChartRef, PieChartProps>(PieChartRender);
type Component = <T extends object>(
  props: PieChartProps<T> & React.RefAttributes<PieChartRef<T>>
) => React.ReactElement;
export const PieChart = React.memo(PieChartComponent) as Component;
