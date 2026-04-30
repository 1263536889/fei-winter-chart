import { useEffect, useState } from 'react';
import { ChartSource, PieChart, PieChartOption } from 'web-chart';

type Data = { name: string; value: number };

function PieExample() {
  const [source, update] = useState<ChartSource<Data>>([]);

  const option: PieChartOption = {
    title: { text: '汇总数据' },
    series: { key: { name: 'name', value: 'value' } },
    totalFormatter: (total) => total?.toFixed(2) ?? '-',
  };

  useEffect(
    () => update(Array.from({ length: 4 }, (v, i) => ({ name: `名称-${i + 1}`, value: Math.random() * 1000 }))),
    []
  );

  return (
    <div>
      <h1>饼图</h1>
      <PieChart height={400} option={option} source={source} />
    </div>
  );
}
export default PieExample;
