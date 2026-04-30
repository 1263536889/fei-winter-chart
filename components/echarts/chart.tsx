import React from 'react';
import { ChartService } from './services/chart.service';
import { ChartRef, ChartProps } from './type';

const ChartRender: React.ForwardRefRenderFunction<ChartRef, ChartProps> = (props, ref) => {
  const { width, height, color, option, source, onBrushChange, service = ChartService } = props;
  const elChart = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<ChartService>();

  const _style = React.useMemo<React.CSSProperties>(
    () => ({ width: width ?? '100%', height: height ?? '100%', overflow: 'hidden', borderRadius: 2 }),
    [width, height]
  );

  React.useLayoutEffect(() => {
    elChart.current && (chart.current = new service(elChart.current, color));
    return () => chart.current?.destroy();
  }, [service, color]);

  React.useEffect(() => chart.current?.render(option), [option]);
  React.useEffect(() => chart.current?.update(source), [source]);

  React.useEffect(() => {
    onBrushChange && chart.current?.onBrush(onBrushChange);
    return () => chart.current?.offBrush();
  }, [onBrushChange]);

  //#region 实例方法
  React.useImperativeHandle(ref, () => chart.current);
  //#endregion

  return <div ref={elChart} style={_style} />;
};
const ChartComponent = React.forwardRef<ChartRef, ChartProps>(ChartRender);
type Component = <S extends ChartService<T>, T extends object>(
  props: ChartProps<T, S> & React.RefAttributes<ChartRef<T, S>>
) => React.ReactElement;
export default React.memo(ChartComponent) as Component;
