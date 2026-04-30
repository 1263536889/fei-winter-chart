import {
  BrushComponent,
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import { ECharts, init, use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type {
  AxisPointerComponentOption,
  BrushComponentOption,
  DataZoomComponentOption,
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts/types/dist/echarts';
import type {
  ChartAxis,
  ChartBrush,
  ChartBrushCallback,
  ChartLegend,
  ChartOption,
  ChartSource,
  ChartTooltip,
  ChartType,
  ChartZoom,
} from '../type';

use([
  CanvasRenderer,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
  ToolboxComponent,
  BrushComponent,
  DatasetComponent,
]);

const PALETTE = ['#165DFF', '#BEDAFF', '#88E3FF', '#0CD2AC', '#8DE173', '#FADC19', '#FF7D00', '#C396ED'];

type BrushSelectEvent = { type: 'brushselected'; batch: [{ areas: { coordRanges: [unknown[]] }[] }] };
type CursorEvent = { type: 'globalcursortaken'; key: string; brushOption: { brushType?: false | string } };

export type ChartServiceConstructor<ChartType> = new (container: HTMLElement, color?: string | string[]) => ChartType;
export class ChartService<DataType extends object = object> {
  protected _chart: ECharts;
  protected _palette: string[];
  #resize = new ResizeObserver(([{ contentRect }]) => this.handleResize(contentRect));

  get #option(): EChartsOption {
    return { color: this._palette, backgroundColor: 'transparent' };
  }

  constructor(container: HTMLElement, color: string | string[] = PALETTE) {
    this._chart = init(container, undefined, { locale: 'ZH' });
    this._palette = color instanceof Array ? color : [color];
    this.#resize.observe(container);
    this._chart.setOption(this.#option);
  }

  destroy(): void {
    this.#resize.disconnect();
    this._chart.dispose();
  }

  render(option: ChartOption = {}): void {
    this._chart.setOption(this.mapOption(option), { replaceMerge: 'series' });
  }

  update(source: ChartSource<DataType> = []): void {
    this._chart.setOption({ dataset: { source } });
  }

  //#region 刷选事件
  onBrush(callback: ChartBrushCallback): void {
    this._chart.on('globalcursortaken', (e) => {
      this._chart.off('brushselected');
      (e as CursorEvent)?.brushOption?.brushType === false &&
        this._chart.on('brushselected', (e) =>
          callback((e as BrushSelectEvent)?.batch[0]?.areas.map(({ coordRanges: [range] }) => range))
        );
    });
  }

  offBrush(): void {
    this._chart.off('globalcursortaken');
    this._chart.off('brushselected');
  }
  //#endregion

  protected mapOption({ legend, zoom, tooltip, brush }: ChartOption, type?: ChartType): EChartsOption {
    return {
      legend: this.mapLegend(legend, type),
      grid: this.#mapGrid(zoom?.show),
      dataZoom: this.mapZoom(zoom),
      tooltip: this.mapTooltip(tooltip, type && ['pie', 'gauge'].includes(type)),
      toolbox: this.mapToolbox(!!brush?.mode?.length),
      brush: this.mapBrush(brush),
    };
  }

  protected mapLegend({ ...legend }: ChartLegend = {}, type?: ChartType): LegendComponentOption {
    return {
      type: 'scroll',
      align: 'left',
      padding: [0, 88],
      itemGap: 16,
      itemWidth: 10,
      itemHeight: 6,
      itemStyle: { borderWidth: 0 },
      inactiveColor: '#86909C80',
      inactiveBorderWidth: 0,
      textStyle: { color: '#86909C', fontWeight: 400, fontSize: 12, lineHeight: 17 },
      icon: this.mapIcon(type),
      borderWidth: 0,
      ...legend,
    };
  }

  protected mapAxis(
    { interval, formatter, ...axis }: ChartAxis = {},
    primary = false
  ): XAXisComponentOption | YAXisComponentOption {
    return {
      type: primary ? 'category' : 'value',
      nameLocation: 'end',
      nameTextStyle: {
        color: '#86909C',
        fontWeight: 400,
        fontSize: 12,
        align: primary ? 'right' : 'left',
        verticalAlign: primary ? 'top' : 'bottom',
        lineHeight: 17,
        padding: 0,
      },
      nameGap: 0,
      axisLine: { show: primary, lineStyle: { color: '#E5E6EB', width: 1 } },
      axisTick: { show: primary, alignWithLabel: true, length: 4, lineStyle: { color: '#E5E6EB', width: 1 } } as object,
      axisLabel: {
        show: true,
        interval,
        margin: 16,
        formatter,
        hideOverlap: true,
        color: '#86909C',
        fontWeight: 400,
        fontSize: 12,
        lineHeight: 17,
        padding: 0,
      } as object,
      splitLine: { show: !primary, lineStyle: { color: '#E5E6EB', width: 1 } },
      axisPointer: { show: primary, label: { show: false } },
      ...axis,
    };
  }

  protected mapZoom({ ...zoom }: ChartZoom = {}): DataZoomComponentOption {
    return {
      type: 'slider',
      show: false,
      backgroundColor: '#F2F3F5',
      dataBackground: { lineStyle: { color: '#165DFF5C', width: 1 }, areaStyle: { opacity: 0 } },
      selectedDataBackground: {
        lineStyle: { color: '#165DFF5C', width: 1 },
        areaStyle: { color: '#165DFF1A', opacity: 1 },
      },
      fillerColor: '#4E596914',
      borderColor: 'transparent',
      handleIcon:
        'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDI2PC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuiuvuWkh+euoeeQhi3orr7lpIflj7DotKYtLeiuvuWkh+ivpuaDhSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM4MS4wMDAwMDAsIC0xMjM4LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNzcuMDAwMDAwLCA3MzcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTI2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDQuMDAwMDAwLCA1MDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgc3Ryb2tlPSIjMTY1REZGIiBmaWxsPSIjRkZGRkZGIiB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjIzIiBoZWlnaHQ9IjIzIiByeD0iMiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIGZpbGw9IiMxNjVERkYiIHg9IjgiIHk9IjciIHdpZHRoPSIxIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9ouWkh+S7vS02MiIgZmlsbD0iIzE2NURGRiIgeD0iMTUiIHk9IjciIHdpZHRoPSIxIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==',
      moveHandleSize: 0,
      textStyle: { color: '#4E5969', fontWeight: 400, fontSize: 12, lineHeight: 16 },
      filterMode: 'weakFilter',
      right: 14,
      bottom: 0,
      height: 24,
      brushSelect: false,
      ...zoom,
    };
  }

  protected mapTooltip(
    { titleFormatter, labelFormatter, valueFormatter, ...tooltip }: ChartTooltip = {},
    single = false
  ): TooltipComponentOption {
    return {
      trigger: single ? 'item' : 'none',
      enterable: true,
      formatter: (series) => {
        if (series instanceof Array) {
          const title = series[0].name;
          return `
            <section style="padding: 8px; backdrop-filter: blur(10px)">
              <h1 style="margin: 0 0 4px; font-size: 12px; font-weight: 400; line-height: 17px; color: #1D2129">
                ${titleFormatter ? titleFormatter(title) : title}
              </h1>
              <div style="display: grid; grid-template-columns: 10px max-content max-content; place-items: center; gap: 8px; padding: 12px; background-color: #FFFFFF; border-radius: 2px">
                ${series
                  .map(({ seriesType, seriesId, seriesName, data, color }) => {
                    const value = (data as Record<string, string>)[seriesId?.split('#').pop() ?? ''];
                    return `
                      <svg style="width: 10; height: 6" viewBox="0 0 1706 1024" fill="${color}">
                        <path d="${this.mapIcon(seriesType as ChartType).slice(7)}" />
                      </svg>
                      <label style="justify-self: start; margin-right: 16px; font-size: 12px; font-weight:400; line-height:17px; color: #86909C">
                        ${labelFormatter ? labelFormatter(seriesName!) : seriesName}
                      </label>
                      <span style="justify-self: end; font-size: 12px; font-weight:500; line-height:17px; color: #1D2129; text-shadow: 0 0 0.25px currentcolor">
                        ${(valueFormatter ? valueFormatter(value) : value) ?? '-'}
                      </span>
                    `;
                  })
                  .join('')}
              </div>
            </section>
          `;
        } else {
          const { seriesType, seriesId, name, data, color } = series;
          const value = (data as Record<string, string>)[seriesId?.split('#').pop() ?? ''];
          return `
            <div style="display: flex; align-items: center; padding: 10px 16px">
              <svg style="width: 10; height: 6" viewBox="0 0 1706 1024" fill="${color}">
                <path d="${this.mapIcon(seriesType as ChartType).slice(7)}" />
              </svg>
              <label style="margin-inline: 4px 24px; font-size: 12px; font-weight:400; line-height:17px; color: #86909C">
                ${labelFormatter ? labelFormatter(name) : name}
              </label>
              <span style="font-size: 12px; font-weight:500; line-height:17px; color: #1D2129; text-shadow: 0 0 0.25px currentcolor">
                ${(valueFormatter ? valueFormatter(value) : value) ?? '-'}
              </span>
            </div>
          `;
        }
      },
      backgroundColor: single ? '#FFFFFFF5' : '##FFFFFF66',
      borderColor: '#FFFFFF',
      borderWidth: single ? 0 : 1,
      padding: 0,
      extraCssText: 'box-shadow: 0 8px 20px 0 #1D21291F; border-radius: 2px;',
      ...tooltip,
    };
  }

  protected mapToolbox(show = false): ToolboxComponentOption {
    return {
      show,
      orient: 'horizontal',
      itemSize: 14,
      itemGap: 10,
      iconStyle: { color: '#C9CDD4', borderColor: '#C9CDD4', borderWidth: 1 },
      emphasis: {
        iconStyle: { color: '#165DFF', borderColor: '#165DFF', borderWidth: 1, textPadding: [16, 0, 0, 0] } as object,
      },
      top: 0,
      right: 0,
    };
  }

  protected mapBrush({ mode, multiple, ...brush }: ChartBrush = {}): BrushComponentOption {
    return {
      toolbox: [
        mode?.includes('x') ? 'lineX' : null,
        mode?.includes('y') ? 'lineY' : null,
        mode?.includes('rect') ? 'rect' : null,
        mode?.includes('any') ? 'polygon' : null,
        multiple ? 'keep' : null,
        'clear',
      ].filter((v) => v) as [],
      seriesIndex: 'all',
      xAxisIndex: 'all',
      yAxisIndex: 'all',
      transformable: false,
      brushStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#FF7D0000' },
            { offset: 1, color: '#FF7D0033' },
          ],
        },
        borderColor: '#FF7D00',
        borderWidth: 1,
        borderType: 'dashed',
      } as object,
      ...brush,
    };
  }

  protected mapPointer(type?: 'line' | 'shadow'): AxisPointerComponentOption {
    return {
      type,
      lineStyle: { color: '#c9cdd4', width: 1, type: 'solid' },
      shadowStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#165DFF00' },
            { offset: 1, color: '#165DFF1F' },
          ],
        },
      },
    };
  }

  protected mapIcon(type?: ChartType): string {
    switch (type) {
      case 'line':
        return 'path://M853,0 a512,512,0,1,1,0,1024,512,512,0,0,1,0,-1024 z m0,170 a341,341,0,1,0,0,682,341,341,0,0,0,0,-682 z M341,426 v170 H0 v-170 h341 z m1365,0 v170 H1365 v-170 h341 z';
      case 'bar':
      case 'pie':
      case 'gauge':
      default:
        return 'path://M341,0 m341,0 l341,0 q341,0,341,341 l0,341 q0,341,-341,341 l-341,0 q-341,0,-341,-341 l0,-341 q0,-341,341,-341 Z';
    }
  }

  protected handleResize({ width, height }: DOMRectReadOnly): void {
    this._chart.resize({ width, height });
  }

  #mapGrid(hasZoom = false): GridComponentOption {
    return { left: 0, top: 58, right: 0, bottom: hasZoom ? 44 : 0, containLabel: true };
  }
}
