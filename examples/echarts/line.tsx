import { useEffect, useState } from 'react';
import { ChartSource, LineChart, LineChartOption } from 'web-chart';

type Data = { x: string; y1: number; y2: number; y3: number };

function LineExample() {
  const [source, update] = useState<ChartSource<Data>>([]);

  const option: LineChartOption = {
    tooltip: {
      titleFormatter: (text) => `标题-${text}`,
      labelFormatter: (text) => `类型${text}`,
      valueFormatter: (value) => (+value).toFixed(),
    },
    brush: { mode: ['x'] },
    x: { name: '名称', formatter: '序列-{value}' },
    y: { name: '单位：%' },
    series: [
      { name: '一', key: { x: 'x', y: 'y1' } },
      { name: '二', key: { x: 'x', y: 'y2' } },
      { name: '三', key: { x: 'x', y: 'y3' } },
    ],
  };

  useEffect(
    () =>
      update(
        Array.from({ length: 10 }, (v, i) => ({
          x: `${i + 1}`,
          y1: Math.random() * 100,
          y2: Math.random() * 100,
          y3: Math.random() * 100,
        }))
      ),
    []
  );

  return (
    <div>
      <h1>折线图</h1>
      <LineChart height={400} option={option} source={source} onBrushChange={console.log} />
    </div>
  );
}
export default LineExample;
