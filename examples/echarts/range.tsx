import { useEffect, useState } from 'react';
import { ChartSource, RangeChart, RangeChartOption } from 'web-chart';

type Data = { y: string; type: string; x1: Date; x2: Date };

function RangeExample() {
  const [source, update] = useState<ChartSource<Data>>([]);

  const option: RangeChartOption = {
    tooltip: {
      valueFormatter: (value) =>
        `${(value as Date[])[0].toLocaleTimeString()}~${(value as Date[])[1].toLocaleTimeString()}`,
    },
    zoom: {
      show: true,
      labelFormatter: (value) => new Date(value).toLocaleTimeString(),
    },
    x: { type: 'time' },
    y: { type: 'category' },
    series: { key: { y: 'y', name: 'type', start: 'x1', end: 'x2' } },
  };

  useEffect(() => {
    update(
      Array.from({ length: 7 }, (v, i) => [
        {
          y: new Date(2000, 1, i + 1).toLocaleDateString(),
          type: '一',
          x1: new Date(2000, 1, 1, Math.random() * 10),
          x2: new Date(2000, 1, 1, 10 + Math.random() * 10),
        },
        {
          y: new Date(2000, 1, i + 1).toLocaleDateString(),
          type: '二',
          x1: new Date(2000, 1, 1, 23),
          x2: new Date(2000, 1, 1, 23, Math.random() * 60),
        },
      ]).flat(1)
    );
    setTimeout(
      () =>
        update(
          Array.from({ length: 7 }, (v, i) => [
            {
              y: new Date(2000, 1, i + 1).toLocaleDateString(),
              type: '一',
              x1: new Date(2000, 1, 1, Math.random() * 10),
              x2: new Date(2000, 1, 1, 10 + Math.random() * 10),
            },
            {
              y: new Date(2000, 1, i + 1).toLocaleDateString(),
              type: '二',
              x1: new Date(2000, 1, 1, 23),
              x2: new Date(2000, 1, 1, 23, Math.random() * 60),
            },
          ]).flat(1)
        ),
      1000
    );
  }, []);

  return (
    <div>
      <h1>范围图</h1>
      <RangeChart height={400} option={option} source={source} />
    </div>
  );
}
export default RangeExample;
