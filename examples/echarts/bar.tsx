import { useEffect, useMemo, useState } from 'react';
import { ChartSource, BarChart, BarChartOption } from 'web-chart';

type Data = { x: string; y: { name: string; value: number }[] };

function BarExample() {
  const [source, update] = useState<ChartSource<Data>>([]);
  const [keys, change] = useState<Set<string>>(new Set());

  const _source: ChartSource<{ x: string; [key: string]: string | number }> = useMemo(() => {
    const keys = new Set<string>();
    const temp = source.map(({ x, y }) => {
      const data: { x: string; [key: string]: string | number } = { x };
      y.forEach(({ name, value }) => {
        keys.add(name);
        data[name] = value;
      });
      return data;
    });
    change(keys);
    return temp;
  }, [source]);

  const option: BarChartOption = useMemo(
    () => ({
      x: { name: '名称', formatter: '序列-{value}' },
      y: { name: '单位：%' },
      series: [...keys].map((key) => ({ key: { x: 'x', y: key }, name: key, stack: 'value' })),
    }),
    [keys]
  );

  useEffect(() => {
    update(
      Array.from({ length: 10 }, (v, i) => ({
        x: `${i + 1}`,
        y: [
          { name: '一', value: Math.random() * 100 },
          { name: '二', value: Math.random() * 100 },
          { name: '三', value: Math.random() * 100 },
        ],
      }))
    );
    setTimeout(
      () =>
        update(
          Array.from({ length: 10 }, (v, i) => ({
            x: `${i + 1}`,
            y: [
              { name: '一', value: Math.random() * 100 },
              { name: '二', value: Math.random() * 100 },
            ],
          }))
        ),
      2333
    );
  }, []);

  return (
    <div>
      <h1>柱状图</h1>
      <BarChart height={400} option={option} source={_source} />
    </div>
  );
}
export default BarExample;
