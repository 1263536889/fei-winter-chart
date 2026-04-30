import type {
  BarSeriesOption,
  BrushComponentOption,
  CustomSeriesOption,
  GaugeSeriesOption,
  LegendComponentOption,
  LineSeriesOption,
  PieSeriesOption,
  SliderDataZoomComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type { ChartService, ChartServiceConstructor } from './services/chart.service';

export type ChartRef<
  DataType extends object = object,
  ChartType extends ChartService<DataType> = ChartService<DataType>
> = ChartType | undefined;
export type ChartProps<
  DataType extends object = object,
  ChartType extends ChartService<DataType> = ChartService<DataType>
> = {
  service?: ChartServiceConstructor<ChartType>;
  option?: ChartOption;
  source?: ChartSource<DataType>;
  width?: string | number;
  height?: string | number;
  color?: string | string[];
  onBrushChange?: ChartBrushCallback;
};

export type ChartSource<DataType extends object = object> = Array<DataType>;

export type ChartBrushCallback = (areas: unknown[]) => void;

export type ChartLegend = Pick<LegendComponentOption, 'show' | 'formatter'>;
export type ChartZoom = Pick<
  SliderDataZoomComponentOption,
  'show' | 'labelFormatter' | 'filterMode' | 'startValue' | 'endValue' | 'minValueSpan' | 'maxValueSpan' | 'zoomLock'
>;
export type ChartTooltip = Pick<TooltipComponentOption, 'show' | 'enterable' | 'valueFormatter'> & {
  titleFormatter?: (text: string) => string;
  labelFormatter?: (text: string) => string;
};
export type ChartBrush = Pick<BrushComponentOption, 'transformable'> & {
  mode?: ('x' | 'y' | 'rect' | 'any')[];
  multiple?: boolean;
};
export type ChartAxis = Pick<XAXisComponentOption | YAXisComponentOption, 'type' | 'name' | 'min' | 'max'> & {
  interval?: number | ((index: number, value: string) => boolean);
  formatter?: string | ((value: string, index: number) => string);
};
export type ChartOption = {
  legend?: ChartLegend;
  zoom?: ChartZoom;
  tooltip?: ChartTooltip;
  brush?: ChartBrush;
};

export type ChartType = (LineSeriesOption | BarSeriesOption | PieSeriesOption | GaugeSeriesOption)['type'];

//#region 折线图
export type LineChartSeries = Omit<LineSeriesOption, 'encode'> & { key: { [key in 'x' | 'y']: React.Key } };
export type LineChartOption = ChartOption & {
  x?: ChartAxis;
  y?: ChartAxis;
  series: LineChartSeries[];
};
//#endregion

//#region 柱状图
export type BarChartSeries = Omit<BarSeriesOption, 'encode'> & { key: { [key in 'x' | 'y']: React.Key } };
export type BarChartOption = ChartOption & {
  x?: ChartAxis;
  y?: ChartAxis;
  series: BarChartSeries[];
};
//#endregion

//#region 饼图
export type PieChartTitle = Pick<TitleComponentOption, 'show' | 'text'>;
export type PieChartSeries = Omit<PieSeriesOption, 'encode'> & { key: { [key in 'name' | 'value']: React.Key } };
export type PieChartOption = Omit<ChartOption, 'zoom'> & {
  totalFormatter?: (total?: number) => string;
  title?: PieChartTitle;
  series: PieChartSeries;
};
//#endregion

//#region 仪表盘
export type GaugeChartData = { name: string; value: number; total: number };
export type GaugeChartSeries = Omit<GaugeSeriesOption, 'encode'>;
export type GaugeChartOption = Omit<ChartOption, 'zoom'> & {
  series?: GaugeChartSeries;
};
//#endregion

//#region 折柱混合图
export type MixChartSeries = LineChartSeries | BarChartSeries;
export type MixChartOption = ChartOption & {
  x?: ChartAxis;
  y?: ChartAxis;
  series: MixChartSeries[];
};
//#endregion

//#region 范围图
export type RangeChartSeries = Omit<CustomSeriesOption, 'renderItem' | 'encode'> & {
  key: { [key in 'y' | 'name' | 'start' | 'end']: React.Key };
};
export type RangeChartOption = ChartOption & {
  x?: ChartAxis;
  y?: ChartAxis;
  series: RangeChartSeries;
};
//#endregion
